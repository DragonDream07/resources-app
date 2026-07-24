/**
 * @typedef {Object} OrderItem
 * @property {string} id
 * @property {string} order_id
 * @property {string} product_id
 * @property {string} product_name
 * @property {string} sku_id
 * @property {string} sku_code
 * @property {Object.<string, string>} sku_attributes
 * @property {string} [image_url]
 * @property {number} quantity
 * @property {number} unit_price
 * @property {number} line_total
 */

/**
 * @typedef {Object} OrderStatusHistory
 * @property {string} id
 * @property {string} order_id
 * @property {string} status
 * @property {string} [note]
 * @property {string} created_at
 */

/**
 * @typedef {Object} OrderTracking
 * @property {string} order_id
 * @property {string} carrier
 * @property {string} tracking_number
 * @property {string} tracking_url
 * @property {string} estimated_delivery
 * @property {string} current_status
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} user_id
 * @property {string} status
 * @property {OrderItem[]} items
 * @property {string} shipping_address_id
 * @property {Object} [shipping_address]
 * @property {string|null} promo_code
 * @property {number} discount_amount
 * @property {number} subtotal
 * @property {number} shipping_total
 * @property {number} grand_total
 * @property {string} payment_status
 * @property {OrderStatusHistory[]} [status_history]
 * @property {OrderTracking} [tracking]
 * @property {string} created_at
 * @property {string} updated_at
 */

export {};
