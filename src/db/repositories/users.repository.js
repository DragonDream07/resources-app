const db = require('../client');

const TABLE = 'users';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByEmail(email) {
  return db(TABLE).where({ email }).first();
}

async function findByPhone(phone) {
  return db(TABLE).where({ phone }).first();
}

async function findByResetToken(reset_password_token) {
  return db(TABLE).where({ reset_password_token }).first();
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

async function list({ limit = 20, offset = 0 } = {}) {
  return db(TABLE).limit(limit).offset(offset);
}

async function count() {
  const [{ total }] = await db(TABLE).count('id as total');
  return Number(total);
}

module.exports = {
  findById,
  findByEmail,
  findByPhone,
  findByResetToken,
  create,
  updateById,
  deleteById,
  list,
  count,
};
