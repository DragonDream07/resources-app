/**
 * @typedef {Object} ProductImage
 * @property {string} id
 * @property {string} product_id
 * @property {string} url
 * @property {string} alt_text
 * @property {number} display_order
 * @property {boolean} is_primary
 */

/**
 * @typedef {Object} SKU
 * @property {string} id
 * @property {string} product_id
 * @property {string} sku_code
 * @property {number} price
 * @property {number} compare_at_price
 * @property {number} stock_quantity
 * @property {Object.<string, string>} attributes - e.g. { color: 'Red', size: 'M' }
 * @property {boolean} is_active
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string|null} parent_id
 * @property {string} [description]
 * @property {string} [image_url]
 * @property {number} display_order
 */

/**
 * @typedef {Object} Brand
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} [description]
 * @property {string} [logo_url]
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {string} category_id
 * @property {Category} [category]
 * @property {string} brand_id
 * @property {Brand} [brand]
 * @property {boolean} is_active
 * @property {SKU[]} [skus]
 * @property {ProductImage[]} [images]
 * @property {string} created_at
 * @property {string} updated_at
 */

export {};
