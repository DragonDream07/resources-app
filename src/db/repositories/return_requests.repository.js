const db = require('../client');

const TABLE = 'return_requests';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByOrderId(order_id) {
  return db(TABLE).where({ order_id });
}

async function listByUserId(user_id, { limit = 20, offset = 0, status } = {}) {
  const query = db(TABLE).where({ user_id }).orderBy('created_at', 'desc');
  if (status) query.where({ status });
  return query.limit(limit).offset(offset);
}

async function list({ limit = 20, offset = 0, status, user_id } = {}) {
  const query = db(TABLE).orderBy('created_at', 'desc');
  if (status) query.where({ status });
  if (user_id) query.where({ user_id });
  return query.limit(limit).offset(offset);
}

async function count({ status, user_id } = {}) {
  const query = db(TABLE).count('id as total');
  if (status) query.where({ status });
  if (user_id) query.where({ user_id });
  const [{ total }] = await query;
  return Number(total);
}

async function create(data, trx) {
  const query = db(TABLE).insert(data);
  if (trx) query.transacting(trx);
  const [id] = await query;
  return db(TABLE).where({ id }).first();
}

async function updateById(id, data, trx) {
  const query = db(TABLE).where({ id }).update(data);
  if (trx) query.transacting(trx);
  await query;
  return db(TABLE).where({ id }).first();
}

module.exports = {
  findById,
  findByOrderId,
  listByUserId,
  list,
  count,
  create,
  updateById,
};
