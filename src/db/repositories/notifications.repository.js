const db = require('../client');

const TABLE = 'notifications';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function listByUserId(user_id, { limit = 20, offset = 0, is_read } = {}) {
  const query = db(TABLE).where({ user_id }).orderBy('created_at', 'desc');
  if (is_read !== undefined) query.where({ is_read });
  return query.limit(limit).offset(offset);
}

async function countByUserId(user_id, { is_read } = {}) {
  const query = db(TABLE).where({ user_id }).count('id as total');
  if (is_read !== undefined) query.where({ is_read });
  const [{ total }] = await query;
  return Number(total);
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

async function markAsRead(id) {
  await db(TABLE).where({ id }).update({ is_read: true });
  return findById(id);
}

async function markAllAsReadForUser(user_id) {
  return db(TABLE).where({ user_id, is_read: false }).update({ is_read: true });
}

async function deleteById(id) {
  return db(TABLE).where({ id }).delete();
}

async function deleteByUserId(user_id) {
  return db(TABLE).where({ user_id }).delete();
}

module.exports = {
  findById,
  listByUserId,
  countByUserId,
  create,
  markAsRead,
  markAllAsReadForUser,
  deleteById,
  deleteByUserId,
};
