const db = require('../../config/db');

const RETURNABLE_STATUSES = ['delivered'];
const RETURN_WINDOW_DAYS = 7;

/**
 * Check whether an order is eligible for a return.
 * @param {string} orderId
 * @param {string} userId
 * @returns {Promise<object>} order row
 */
async function checkReturnEligibility(orderId, userId) {
  const { rows } = await db.query(
    `SELECT * FROM orders WHERE id = $1 AND user_id = $2`,
    [orderId, userId]
  );

  if (rows.length === 0) {
    const err = new Error('Order not found.');
    err.statusCode = 404;
    throw err;
  }

  const order = rows[0];

  if (!RETURNABLE_STATUSES.includes(order.status)) {
    const err = new Error('Order is not eligible for return.');
    err.statusCode = 422;
    throw err;
  }

  const deliveredAt = order.delivered_at || order.updated_at;
  const windowMs = RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  if (Date.now() - new Date(deliveredAt).getTime() > windowMs) {
    const err = new Error('Return window has expired.');
    err.statusCode = 422;
    throw err;
  }

  const { rows: existing } = await db.query(
    `SELECT id FROM return_requests WHERE order_id = $1 AND status NOT IN ('rejected')`,
    [orderId]
  );

  if (existing.length > 0) {
    const err = new Error('A return request already exists for this order.');
    err.statusCode = 409;
    throw err;
  }

  return order;
}

/**
 * Create a return request.
 * @param {string} orderId
 * @param {string} userId
 * @param {object} payload - { reason, items }
 * @returns {Promise<object>}
 */
async function createReturnRequest(orderId, userId, payload) {
  await checkReturnEligibility(orderId, userId);

  const { reason, items } = payload;

  const { rows } = await db.query(
    `INSERT INTO return_requests (order_id, user_id, reason, items, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, 'pending', NOW(), NOW())
     RETURNING *`,
    [orderId, userId, reason, JSON.stringify(items || [])]
  );

  return rows[0];
}

/**
 * List all return requests (admin).
 * @param {object} filters - { status, page, limit }
 * @returns {Promise<object>}
 */
async function listReturnRequests(filters = {}) {
  const { status, page = 1, limit = 20 } = filters;
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const values = [];
  const conditions = [];

  if (status) {
    values.push(status);
    conditions.push(`rr.status = $${values.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  values.push(parseInt(limit, 10));
  const limitPlaceholder = `$${values.length}`;
  values.push(offset);
  const offsetPlaceholder = `$${values.length}`;

  const { rows } = await db.query(
    `SELECT rr.*, o.user_id, o.total_amount
     FROM return_requests rr
     JOIN orders o ON o.id = rr.order_id
     ${where}
     ORDER BY rr.created_at DESC
     LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}`,
    values
  );

  const countValues = status ? [status] : [];
  const countWhere = status ? `WHERE status = $1` : '';
  const { rows: countRows } = await db.query(
    `SELECT COUNT(*) AS total FROM return_requests ${countWhere}`,
    countValues
  );

  return {
    items: rows,
    total: parseInt(countRows[0].total, 10),
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };
}

/**
 * Get a single return request.
 * @param {string} returnRequestId
 * @param {string} userId
 * @param {string} userRole
 * @returns {Promise<object>}
 */
async function getReturnRequest(returnRequestId, userId, userRole) {
  const { rows } = await db.query(
    `SELECT * FROM return_requests WHERE id = $1`,
    [returnRequestId]
  );

  if (rows.length === 0) {
    const err = new Error('Return request not found.');
    err.statusCode = 404;
    throw err;
  }

  const returnRequest = rows[0];

  if (userRole !== 'admin' && returnRequest.user_id !== userId) {
    const err = new Error('Forbidden.');
    err.statusCode = 403;
    throw err;
  }

  return returnRequest;
}

/**
 * Trigger a refund for a return request.
 * @param {object} returnRequest
 * @param {object} client - DB client (within transaction)
 * @returns {Promise<object>} refund row
 */
async function triggerRefund(returnRequest, client) {
  const { rows } = await client.query(
    `INSERT INTO refunds (order_id, return_request_id, amount, status, created_at, updated_at)
     SELECT o.id, $1, o.total_amount, 'pending', NOW(), NOW()
     FROM orders o WHERE o.id = $2
     RETURNING *`,
    [returnRequest.id, returnRequest.order_id]
  );
  return rows[0];
}

/**
 * Restore stock for items in a return request.
 * @param {object} returnRequest
 * @param {object} client - DB client (within transaction)
 */
async function restoreStock(returnRequest, client) {
  const items = Array.isArray(returnRequest.items)
    ? returnRequest.items
    : JSON.parse(returnRequest.items || '[]');

  for (const item of items) {
    if (item.sku_id && item.quantity) {
      await client.query(
        `UPDATE skus SET stock = stock + $1 WHERE id = $2`,
        [item.quantity, item.sku_id]
      );
    }
  }
}

/**
 * Review (approve or reject) a return request.
 * @param {string} returnRequestId
 * @param {string} adminId
 * @param {object} payload - { decision, notes }
 * @returns {Promise<object>}
 */
async function reviewReturnRequest(returnRequestId, adminId, payload) {
  const { decision, notes } = payload;

  const { rows } = await db.query(
    `SELECT * FROM return_requests WHERE id = $1`,
    [returnRequestId]
  );

  if (rows.length === 0) {
    const err = new Error('Return request not found.');
    err.statusCode = 404;
    throw err;
  }

  const returnRequest = rows[0];

  if (returnRequest.status !== 'pending') {
    const err = new Error('Return request has already been reviewed.');
    err.statusCode = 422;
    throw err;
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const { rows: updated } = await client.query(
      `UPDATE return_requests
       SET status = $1, admin_notes = $2, reviewed_by = $3, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [decision, notes || null, adminId, returnRequestId]
    );

    const updatedReturn = updated[0];

    if (decision === 'approved') {
      await triggerRefund(updatedReturn, client);
      await restoreStock(updatedReturn, client);

      await client.query(
        `UPDATE orders SET status = 'return_approved', updated_at = NOW() WHERE id = $1`,
        [updatedReturn.order_id]
      );
    } else if (decision === 'rejected') {
      await client.query(
        `UPDATE orders SET status = 'return_rejected', updated_at = NOW() WHERE id = $1`,
        [updatedReturn.order_id]
      );
    }

    await client.query('COMMIT');
    return updatedReturn;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  createReturnRequest,
  listReturnRequests,
  getReturnRequest,
  reviewReturnRequest,
  checkReturnEligibility,
};
