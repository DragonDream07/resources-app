const db = require('../client');

const TABLE = 'payment_attempts';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByGatewayReference(gateway_reference) {
  return db(TABLE).where({ gateway_reference }).first();
}

async function listByOrderId(order_id) {
  return db(TABLE).where({ order_id }).orderBy('created_at', 'desc');
}

async function findLatestByOrderId(order_id) {
  return db(TABLE).where({ order_id }).orderBy('created_at', 'desc').first();
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
  findByGatewayReference,
  listByOrderId,
  findLatestByOrderId,
  create,
  updateById,
};
