/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} phone
 * @property {string} role - 'customer' | 'admin' | 'guest'
 * @property {boolean} is_guest
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} LoginPayload
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterPayload
 * @property {string} email
 * @property {string} password
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} [phone]
 */

/**
 * @typedef {Object} ResetPayload
 * @property {string} token
 * @property {string} new_password
 */

export {};
