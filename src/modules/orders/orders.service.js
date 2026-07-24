const db = require('../../db');

const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURN_REQUESTED: 'return_requested',
  RETURNED: 'returned',
};

const ALLOWED_TRANSITIONS = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.OUT_FOR_DELIVERY]: [ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.RETURN_REQUESTED],
  [ORDER_STATUS.RETURN_REQUESTED]: [ORDER_STATUS.RETURNED],
  [ORDER_STATUS.CANCELLED]: [],
  [ORDER_STATUS.RETURNED]: [],
};

const CANCELLABLE_STATUSES = [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED, ORDER_STATUS.PROCESSING];

async function listOrders(filters) {
  const { page, limit, status, userId, isAdmin } = filters;
  const offset = (page - 1) * limit;

  const conditions = [];
  const params = [];
  let idx = 1;

  if (!isAdmin && userId) {
    conditions.push(`o.user_id = $${idx++}`);
    params.push(userId);
  } else if (isAdmin && userId) {
    conditions.push(`o.user_id = $${idx++}`);
    params.push(userId);
  }

  if (status) {
    conditions.push(`o.status = $${idx++}`);
    params.push(status);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await db.query(
    `SELECT COUNT(*) FROM orders o ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count, 10);

  params.push(limit);
  params.push(offset);

  const result = await db.query(
    `SELECT o.*, u.email AS user_email
     FROM orders o
     LEFT JOIN users u ON o.user_id = u.id
     ${whereClause}
     ORDER BY o.created_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    params
  );

  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getOrder(orderId, userId, isAdmin) {
  const result = await db.query(
    `SELECT o.*, u.email AS user_email
     FROM orders o
     LEFT JOIN users u ON o.user_id = u.id
     WHERE o.id = $1`,
    [orderId]
  );

  if (result.rows.length === 0) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }

  const order = result.rows[0];

  if (!isAdmin && order.user_id !== userId) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }

  const itemsResult = await db.query(
    `SELECT oi.*, p.name AS product_name, s.sku_code
     FROM order_items oi
     LEFT JOIN skus s ON oi.sku_id = s.id
     LEFT JOIN products p ON s.product_id = p.id
     WHERE oi.order_id = $1`,
    [orderId]
  );

  order.items = itemsResult.rows;
  return order;
}

async function getOrderTimeline(orderId, userId, isAdmin) {
  const order = await getOrder(orderId, userId, isAdmin);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }

  const result = await db.query(
    `SELECT * FROM order_status_history
     WHERE order_id = $1
     ORDER BY created_at ASC`,
    [orderId]
  );

  return { orderId, timeline: result.rows };
}

async function getOrderTracking(orderId, userId, isAdmin) {
  const order = await getOrder(orderId, userId, isAdmin);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }

  const result = await db.query(
    `SELECT * FROM order_tracking WHERE order_id = $1`,
    [orderId]
  );

  if (result.rows.length === 0) {
    return { orderId, tracking: null };
  }

  return { orderId, tracking: result.rows[0] };
}

async function getOrderRefunds(orderId, userId, isAdmin) {
  const order = await getOrder(orderId, userId, isAdmin);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }

  const result = await db.query(
    `SELECT * FROM refunds WHERE order_id = $1 ORDER BY created_at DESC`,
    [orderId]
  );

  return { orderId, refunds: result.rows };
}

async function cancelOrder(orderId, userId, isAdmin, reason) {
  const order = await getOrder(orderId, userId, isAdmin);

  if (!CANCELLABLE_STATUSES.includes(order.status)) {
    const err = new Error('Order cannot be cancelled in its current status');
    err.status = 422;
    throw err;
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const updateResult = await client.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [ORDER_STATUS.CANCELLED, orderId]
    );

    await client.query(
      `INSERT INTO order_status_history (order_id, status, notes, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [orderId, ORDER_STATUS.CANCELLED, reason || null]
    );

    await client.query('COMMIT');
    return updateResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function advanceOrder(orderId, newStatus, trackingData) {
  const result = await db.query(`SELECT * FROM orders WHERE id = $1`, [orderId]);

  if (result.rows.length === 0) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }

  const order = result.rows[0];
  const allowed = ALLOWED_TRANSITIONS[order.status] || [];

  if (!allowed.includes(newStatus)) {
    const err = new Error(`Cannot transition order from '${order.status}' to '${newStatus}'`);
    err.status = 422;
    throw err;
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const updateResult = await client.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [newStatus, orderId]
    );

    await client.query(
      `INSERT INTO order_status_history (order_id, status, notes, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [orderId, newStatus, null]
    );

    if (newStatus === ORDER_STATUS.SHIPPED && trackingData && trackingData.trackingNumber) {
      const { trackingNumber, carrier, trackingUrl } = trackingData;
      const existingTracking = await client.query(
        `SELECT id FROM order_tracking WHERE order_id = $1`,
        [orderId]
      );
      if (existingTracking.rows.length > 0) {
        await client.query(
          `UPDATE order_tracking
           SET tracking_number = $1, carrier = $2, tracking_url = $3, updated_at = NOW()
           WHERE order_id = $4`,
          [trackingNumber, carrier || null, trackingUrl || null, orderId]
        );
      } else {
        await client.query(
          `INSERT INTO order_tracking (order_id, tracking_number, carrier, tracking_url, created_at, updated_at)
           VALUES ($1, $2, $3, $4, NOW(), NOW())`,
          [orderId, trackingNumber, carrier || null, trackingUrl || null]
        );
      }
    }

    await client.query('COMMIT');
    return updateResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function createOrderFromCheckout(checkoutData) {
  const { userId, addressId, items, subtotal, discount, tax, total, promoCodeId, paymentMethod, notes } = checkoutData;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      `INSERT INTO orders
         (user_id, address_id, status, subtotal, discount, tax, total, promo_code_id, payment_method, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
       RETURNING *`,
      [
        userId,
        addressId,
        ORDER_STATUS.PENDING,
        subtotal,
        discount || 0,
        tax || 0,
        total,
        promoCodeId || null,
        paymentMethod || null,
        notes || null,
      ]
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, sku_id, quantity, unit_price, total_price, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [order.id, item.skuId, item.quantity, item.unitPrice, item.totalPrice]
      );
    }

    await client.query(
      `INSERT INTO order_status_history (order_id, status, notes, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [order.id, ORDER_STATUS.PENDING, 'Order placed']
    );

    await client.query('COMMIT');
    return order;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function createReturnRequest(orderId, userId, payload) {
  const order = await getOrder(orderId, userId, false);

  if (order.status !== ORDER_STATUS.DELIVERED) {
    const err = new Error('Return requests can only be made for delivered orders');
    err.status = 422;
    throw err;
  }

  const { items, reason, notes } = payload;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const rrResult = await client.query(
      `INSERT INTO return_requests (order_id, user_id, reason, notes, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'pending', NOW(), NOW())
       RETURNING *`,
      [orderId, userId, reason, notes || null]
    );

    const returnRequest = rrResult.rows[0];

    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO return_request_items (return_request_id, order_item_id, quantity, created_at)
           VALUES ($1, $2, $3, NOW())`,
          [returnRequest.id, item.orderItemId, item.quantity]
        );
      }
    }

    await client.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2`,
      [ORDER_STATUS.RETURN_REQUESTED, orderId]
    );

    await client.query(
      `INSERT INTO order_status_history (order_id, status, notes, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [orderId, ORDER_STATUS.RETURN_REQUESTED, reason]
    );

    await client.query('COMMIT');
    return returnRequest;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  listOrders,
  getOrder,
  getOrderTimeline,
  getOrderTracking,
  getOrderRefunds,
  cancelOrder,
  advanceOrder,
  createOrderFromCheckout,
  createReturnRequest,
  ORDER_STATUS,
};
