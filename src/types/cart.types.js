/**
 * @typedef {Object} CartItem
 * @property {string} id
 * @property {string} cart_id
 * @property {string} product_id
 * @property {string} sku_id
 * @property {string} product_name
 * @property {string} sku_code
 * @property {Object.<string, string>} sku_attributes
 * @property {string} [image_url]
 * @property {number} quantity
 * @property {number} unit_price
 * @property {number} line_total
 */

/**
 * @typedef {Object} Cart
 * @property {string} id
 * @property {string|null} user_id
 * @property {CartItem[]} items
 * @property {string|null} promo_code
 * @property {number} discount_amount
 * @property {number} subtotal
 * @property {number} shipping_total
 * @property {number} grand_total
 * @property {string} created_at
 * @property {string} updated_at
 */

export {};
