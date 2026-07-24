/**
 * @typedef {Object} DashboardStats
 * @property {number} total_orders
 * @property {number} total_revenue
 * @property {number} total_users
 * @property {number} total_products
 * @property {number} pending_returns
 * @property {number} low_stock_skus
 */

/**
 * @typedef {Object} ReportData
 * @property {string} period
 * @property {number} revenue
 * @property {number} orders_count
 * @property {number} avg_order_value
 * @property {{ label: string, value: number }[]} [chart_data]
 */

/**
 * @typedef {Object} AdminUser
 * @property {string} id
 * @property {string} email
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} phone
 * @property {string} role - 'customer' | 'admin'
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string} updated_at
 */

export {};
