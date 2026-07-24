const db = require('../client');

const TABLE = 'addresses';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByIdAndUserId(id, user_id) {
  return db(TABLE).where({ id, user_id }).first();
}

async function listByUserId(user_id) {
  return db(TABLE).where({ user_id }).orderBy('created_at', 'desc');
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

async function updateById(id, data) {
  await db(TABLE).where({ id }).update(data);
  return findById(id);
}

async function deleteById(id) {
  return db(TABLE).where({ id }).delete();
}

async function clearDefaultForUser(user_id) {
  return db(TABLE).where({ user_id, is_default: true }).update({ is_default: false });
}

module.exports = {
  findById,
  findByIdAndUserId,
  listByUserId,
  create,
  updateById,
  deleteById,
  clearDefaultForUser,
};
