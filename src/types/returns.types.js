/**
 * @typedef {Object} ReturnRequest
 * @property {string} id
 * @property {string} order_id
 * @property {string} user_id
 * @property {string} status - 'pending' | 'approved' | 'rejected' | 'completed'
 * @property {string} reason
 * @property {string} [notes]
 * @property {{ order_item_id: string, quantity: number }[]} items
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Refund
 * @property {string} id
 * @property {string} order_id
 * @property {string} return_request_id
 * @property {number} amount
 * @property {string} status - 'pending' | 'processed' | 'failed'
 * @property {string} [notes]
 * @property {string} created_at
 * @property {string} updated_at
 */

export {};
