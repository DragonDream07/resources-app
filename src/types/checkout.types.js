/**
 * @typedef {Object} CheckoutInitiatePayload
 * @property {string} cart_id
 * @property {string} address_id
 * @property {string} [promo_code]
 */

/**
 * @typedef {Object} CheckoutConfirmPayload
 * @property {string} cart_id
 * @property {string} address_id
 * @property {string} [promo_code]
 * @property {string} payment_method - e.g. 'mock_card' | 'cod'
 */

export {};
