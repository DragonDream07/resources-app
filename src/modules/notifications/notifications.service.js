const db = require('../../db');

/**
 * Create a notification for a user. Intended to be called by other services.
 * @param {object} params
 * @param {number|string} params.userId
 * @param {string} params.type
 * @param {string} params.title
 * @param {string} params.body
 * @param {object} [params.meta]
 * @returns {Promise<object>}
 */
const createNotification = async ({ userId, type, title, body, meta = null }) => {
  const [notification] = await db('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      body,
      meta: meta ? JSON.stringify(meta) : null,
      is_read: false,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })
    .returning('*');
  return notification;
};

/**
 * Retrieve paginated notifications for a user.
 * @param {number|string} userId
 * @param {object} options
 * @param {number} options.page
 * @param {number} options.limit
 * @param {boolean|undefined} options.unread
 * @returns {Promise<object>}
 */
const getNotifications = async (userId, { page = 1, limit = 20, unread } = {}) => {
  const offset = (page - 1) * limit;

  let query = db('notifications').where({ user_id: userId });

  if (unread === true) {
    query = query.where({ is_read: false });
  } else if (unread === false) {
    query = query.where({ is_read: true });
  }

  const totalQuery = query.clone().count('id as count').first();
  const rowsQuery = query
    .clone()
    .select('*')
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);

  const [totalResult, rows] = await Promise.all([totalQuery, rowsQuery]);
  const total = parseInt(totalResult.count, 10);

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Retrieve a single notification by id, scoped to the user.
 * @param {number|string} userId
 * @param {number|string} notificationId
 * @returns {Promise<object|null>}
 */
const getNotificationById = async (userId, notificationId) => {
  const notification = await db('notifications')
    .where({ id: notificationId, user_id: userId })
    .first();
  return notification || null;
};

/**
 * Get the unread notification count for a user.
 * @param {number|string} userId
 * @returns {Promise<number>}
 */
const getUnreadCount = async (userId) => {
  const result = await db('notifications')
    .where({ user_id: userId, is_read: false })
    .count('id as count')
    .first();
  return parseInt(result.count, 10);
};

/**
 * Mark all notifications for a user as read.
 * @param {number|string} userId
 * @returns {Promise<void>}
 */
const markAllRead = async (userId) => {
  await db('notifications')
    .where({ user_id: userId, is_read: false })
    .update({ is_read: true, updated_at: db.fn.now() });
};

/**
 * Mark a single notification as read, scoped to the user.
 * @param {number|string} userId
 * @param {number|string} notificationId
 * @returns {Promise<object|null>}
 */
const markOneRead = async (userId, notificationId) => {
  const existing = await db('notifications')
    .where({ id: notificationId, user_id: userId })
    .first();

  if (!existing) {
    return null;
  }

  const [updated] = await db('notifications')
    .where({ id: notificationId, user_id: userId })
    .update({ is_read: true, updated_at: db.fn.now() })
    .returning('*');

  return updated;
};

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  getUnreadCount,
  markAllRead,
  markOneRead,
};
