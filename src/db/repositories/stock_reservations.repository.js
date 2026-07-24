const db = require('../client');

const TABLE = 'stock_reservations';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByOrderId(order_id) {
  return db(TABLE).where({ order_id });
}

async function findByOrderAndSku(order_id, sku_id) {
  return db(TABLE).where({ order_id, sku_id }).first();
}

async function listActive() {
  return db(TABLE).where({ status: 'active' });
}

async function create(data, trx) {
  const query = db(TABLE).insert(data);
  if (trx) query.transacting(trx);
  const [id] = await query;
  return db(TABLE).where({ id }).first();
}

async function bulkCreate(items, trx) {
  const query = db(TABLE).insert(items);
  if (trx) query.transacting(trx);
  return query;
}

async function updateById(id, data, trx) {
  const query = db(TABLE).where({ id }).update(data);
  if (trx) query.transacting(trx);
  await query;
  return db(TABLE).where({ id }).first();
}

async function updateByOrderId(order_id, data, trx) {
  const query = db(TABLE).where({ order_id }).update(data);
  if (trx) query.transacting(trx);
  return query;
}

async function deleteById(id) {
  return db(TABLE).where({ id }).delete();
}

async function deleteByOrderId(order_id) {
  return db(TABLE).where({ order_id }).delete();
}

module.exports = {
  findById,
  findByOrderId,
  findByOrderAndSku,
  listActive,
  create,
  bulkCreate,
  updateById,
  updateByOrderId,
  deleteById,
  deleteByOrderId,
};
