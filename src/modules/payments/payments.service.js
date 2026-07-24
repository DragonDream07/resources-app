const { v4: uuidv4 } = require('uuid');
const db = require('../../config/db');

/**
 * In-memory adapter registry — register provider adapters here.
 * Each adapter must implement: { initiate(payload), verify(payload, headers), refund(paymentId) }
 */
const adapterRegistry = {};

function registerAdapter(providerName, adapterInstance) {
  adapterRegistry[providerName] = adapterInstance;
}

function getAdapter(providerName) {
  const adapter = adapterRegistry[providerName];
  if (!adapter) {
    throw Object.assign(new Error(`Payment provider '${providerName}' is not configured.`), { statusCode: 400 });
  }
  return adapter;
}

/**
 * Persists a payment attempt record.
 */
async function createPaymentAttempt({ orderId, paymentId, provider, status, providerRef, metadata }) {
  const attemptId = uuidv4();
  await db.query(
    `INSERT INTO payment_attempts
       (id, order_id, payment_id, provider, status, provider_ref, metadata, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
    [
      attemptId,
      orderId,
      paymentId,
      provider,
      status,
      providerRef || null,
      metadata ? JSON.stringify(metadata) : null,
    ]
  );
  return attemptId;
}

/**
 * Updates a payment attempt status.
 */
async function updatePaymentAttempt(attemptId, { status, providerRef, metadata }) {
  await db.query(
    `UPDATE payment_attempts
        SET status = $1,
            provider_ref = COALESCE($2, provider_ref),
            metadata = COALESCE($3, metadata),
            updated_at = NOW()
      WHERE id = $4`,
    [status, providerRef || null, metadata ? JSON.stringify(metadata) : null, attemptId]
  );
}

/**
 * POST /payments/initiate
 * Orchestrates payment initiation: creates a payment record, delegates to active adapter.
 */
async function initiatePayment(body, user) {
  const { orderId, provider, amount, currency, method, returnUrl, metadata } = body;

  const paymentId = uuidv4();

  // Persist initial payment record
  await db.query(
    `INSERT INTO payments
       (id, order_id, user_id, provider, amount, currency, method, status, return_url, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8, NOW(), NOW())`,
    [
      paymentId,
      orderId,
      user ? user.id : null,
      provider,
      amount,
      currency || 'INR',
      method || null,
      returnUrl || null,
    ]
  );

  // Persist attempt
  const attemptId = await createPaymentAttempt({
    orderId,
    paymentId,
    provider,
    status: 'initiated',
    metadata,
  });

  let providerResponse = {};
  try {
    const adapter = getAdapter(provider);
    providerResponse = await adapter.initiate({
      paymentId,
      orderId,
      amount,
      currency: currency || 'INR',
      method,
      returnUrl,
      metadata,
    });

    await updatePaymentAttempt(attemptId, {
      status: 'initiated',
      providerRef: providerResponse.providerRef || null,
      metadata: providerResponse,
    });
  } catch (err) {
    await updatePaymentAttempt(attemptId, { status: 'failed', metadata: { error: err.message } });
    await db.query(
      `UPDATE payments SET status = 'failed', updated_at = NOW() WHERE id = $1`,
      [paymentId]
    );
    throw err;
  }

  return {
    paymentId,
    attemptId,
    provider,
    status: 'initiated',
    providerData: providerResponse,
  };
}

/**
 * POST /payments/callback
 * Handles provider webhook / redirect callback. Verifies and updates payment status.
 */
async function handleCallback(body, headers) {
  const { paymentId, provider, providerRef, status: providerStatus, metadata } = body;

  let payment;
  if (paymentId) {
    const { rows } = await db.query(`SELECT * FROM payments WHERE id = $1 LIMIT 1`, [paymentId]);
    payment = rows[0];
  }

  if (!payment && providerRef) {
    const { rows } = await db.query(
      `SELECT p.* FROM payments p
         JOIN payment_attempts pa ON pa.payment_id = p.id
        WHERE pa.provider_ref = $1
        LIMIT 1`,
      [providerRef]
    );
    payment = rows[0];
  }

  if (!payment) {
    throw Object.assign(new Error('Payment record not found for callback.'), { statusCode: 404 });
  }

  let verifiedStatus = 'pending';
  try {
    const adapter = getAdapter(payment.provider);
    const verification = await adapter.verify(body, headers);
    verifiedStatus = verification.status || providerStatus || 'pending';
  } catch {
    // If adapter not found or verification fails, fall back to provider-supplied status
    verifiedStatus = providerStatus || 'pending';
  }

  const mappedStatus = mapProviderStatus(verifiedStatus);

  await db.query(
    `UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2`,
    [mappedStatus, payment.id]
  );

  // Update linked attempt
  await db.query(
    `UPDATE payment_attempts
        SET status = $1, provider_ref = COALESCE($2, provider_ref), updated_at = NOW()
      WHERE payment_id = $3
      ORDER BY created_at DESC
      LIMIT 1`,
    [mappedStatus, providerRef || null, payment.id]
  );

  // Update order payment status if terminal
  if (mappedStatus === 'paid' || mappedStatus === 'failed') {
    await db.query(
      `UPDATE orders SET payment_status = $1, updated_at = NOW() WHERE id = $2`,
      [mappedStatus, payment.order_id]
    );
  }

  return {
    paymentId: payment.id,
    orderId: payment.order_id,
    status: mappedStatus,
  };
}

/**
 * GET /payments/:paymentId
 * Fetches a single payment by ID.
 */
async function getPaymentById(paymentId, user) {
  const { rows } = await db.query(
    `SELECT p.*,
            json_agg(pa.* ORDER BY pa.created_at ASC) AS attempts
       FROM payments p
       LEFT JOIN payment_attempts pa ON pa.payment_id = p.id
      WHERE p.id = $1
      GROUP BY p.id
      LIMIT 1`,
    [paymentId]
  );
  const payment = rows[0];
  if (!payment) return null;

  // Non-admin users may only view their own payments
  if (user && user.role !== 'admin' && payment.user_id && payment.user_id !== user.id) {
    throw Object.assign(new Error('Access denied.'), { statusCode: 403 });
  }

  return payment;
}

/**
 * POST /payments/:paymentId/retry
 * Retries a failed payment by creating a new attempt via the active adapter.
 */
async function retryPayment(paymentId, body, user) {
  const { rows } = await db.query(`SELECT * FROM payments WHERE id = $1 LIMIT 1`, [paymentId]);
  const payment = rows[0];

  if (!payment) {
    throw Object.assign(new Error('Payment not found.'), { statusCode: 404 });
  }

  if (!['failed', 'pending'].includes(payment.status)) {
    throw Object.assign(
      new Error('Only failed or pending payments can be retried.'),
      { statusCode: 400 }
    );
  }

  // Non-admin users may only retry their own payments
  if (user && user.role !== 'admin' && payment.user_id && payment.user_id !== user.id) {
    throw Object.assign(new Error('Access denied.'), { statusCode: 403 });
  }

  const provider = body.provider || payment.provider;
  const attemptId = await createPaymentAttempt({
    orderId: payment.order_id,
    paymentId: payment.id,
    provider,
    status: 'initiated',
    metadata: body.metadata || null,
  });

  let providerResponse = {};
  try {
    const adapter = getAdapter(provider);
    providerResponse = await adapter.initiate({
      paymentId: payment.id,
      orderId: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      returnUrl: payment.return_url,
      metadata: body.metadata,
    });

    await updatePaymentAttempt(attemptId, {
      status: 'initiated',
      providerRef: providerResponse.providerRef || null,
      metadata: providerResponse,
    });

    await db.query(
      `UPDATE payments SET status = 'pending', provider = $1, updated_at = NOW() WHERE id = $2`,
      [provider, payment.id]
    );
  } catch (err) {
    await updatePaymentAttempt(attemptId, { status: 'failed', metadata: { error: err.message } });
    throw err;
  }

  return {
    paymentId: payment.id,
    attemptId,
    provider,
    status: 'initiated',
    providerData: providerResponse,
  };
}

/**
 * Maps provider-specific status strings to internal status values.
 */
function mapProviderStatus(providerStatus) {
  const mapping = {
    success: 'paid',
    succeeded: 'paid',
    paid: 'paid',
    captured: 'paid',
    failed: 'failed',
    failure: 'failed',
    cancelled: 'cancelled',
    canceled: 'cancelled',
    pending: 'pending',
    initiated: 'pending',
  };
  return mapping[(providerStatus || '').toLowerCase()] || 'pending';
}

module.exports = {
  initiatePayment,
  handleCallback,
  getPaymentById,
  retryPayment,
  registerAdapter,
};
