/**
 * @typedef {Object} PaymentAttempt
 * @property {string} id
 * @property {string} order_id
 * @property {string} payment_method
 * @property {number} amount
 * @property {string} currency
 * @property {string} status - 'pending' | 'success' | 'failure'
 * @property {string} [gateway_reference]
 * @property {string} initiated_at
 * @property {string} [completed_at]
 */

/**
 * @typedef {Object} PaymentOutcome
 * @property {string} status - 'success' | 'failure' | 'pending'
 * @property {string} order_id
 * @property {string} payment_attempt_id
 * @property {string} [failure_reason]
 * @property {string} [redirect_url]
 */

export {};
