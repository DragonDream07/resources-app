const db = require('../client');

const TABLE = 'promo_codes';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByCode(code) {
  return db(TABLE).where({ code }).first();
}

async function list({ limit = 20, offset = 0, is_active } = {}) {
  const query = db(TABLE).orderBy('created_at', 'desc');
  if (is_active !== undefined) query.where({ is_active });
  return query.limit(limit).offset(offset);
}

async function count({ is_active } = {}) {
  const query = db(TABLE).count('id as total');
  if (is_active !== undefined) query.where({ is_active });
  const [{ total }] = await query;
  return Number(total);
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

async function updateById(id, data) {
  await db(TABLE).where({ id }).update(data);
  return findById(id);
}

async function incrementUsageCount(id, trx) {
  const query = db(TABLE).where({ id }).increment('usage_count', 1);
  if (trx) query.transacting(trx);
  return query;
}

async function deleteById(id) {
  return db(TABLE).where({ id }).delete();
}

module.exports = {
  findById,
  findByCode,
  list,
  count,
  create,
  updateById,
  incrementUsageCount,
  deleteById,
};
