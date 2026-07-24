const db = require('../client');

const TABLE = 'refunds';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByGatewayRefundId(gateway_refund_id) {
  return db(TABLE).where({ gateway_refund_id }).first();
}

async function listByOrderId(order_id) {
  return db(TABLE).where({ order_id }).orderBy('created_at', 'desc');
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

async function totalRefundedForOrder(order_id) {
  const [{ total }] = await db(TABLE)
    .where({ order_id, status: 'succeeded' })
    .sum('amount as total');
  return Number(total) || 0;
}

module.exports = {
  findById,
  findByGatewayRefundId,
  listByOrderId,
  create,
  updateById,
  totalRefundedForOrder,
};
