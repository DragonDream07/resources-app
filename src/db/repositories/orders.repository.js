const db = require('../client');

const ORDERS_TABLE = 'orders';
const ITEMS_TABLE = 'order_items';
const HISTORY_TABLE = 'order_status_history';
const TRACKING_TABLE = 'order_tracking';

// --- Orders ---

async function findById(id) {
  return db(ORDERS_TABLE).where({ id }).first();
}

async function findByOrderNumber(order_number) {
  return db(ORDERS_TABLE).where({ order_number }).first();
}

async function listByUserId(user_id, { limit = 20, offset = 0, status } = {}) {
  const query = db(ORDERS_TABLE)
    .where({ user_id })
    .orderBy('created_at', 'desc');
  if (status) query.where({ status });
  return query.limit(limit).offset(offset);
}

async function countByUserId(user_id, { status } = {}) {
  const query = db(ORDERS_TABLE).where({ user_id }).count('id as total');
  if (status) query.where({ status });
  const [{ total }] = await query;
  return Number(total);
}

async function list({ limit = 20, offset = 0, status, user_id } = {}) {
  const query = db(ORDERS_TABLE).orderBy('created_at', 'desc');
  if (status) query.where({ status });
  if (user_id) query.where({ user_id });
  return query.limit(limit).offset(offset);
}

async function count({ status, user_id } = {}) {
  const query = db(ORDERS_TABLE).count('id as total');
  if (status) query.where({ status });
  if (user_id) query.where({ user_id });
  const [{ total }] = await query;
  return Number(total);
}

async function create(data, trx) {
  const query = db(ORDERS_TABLE).insert(data);
  if (trx) query.transacting(trx);
  const [id] = await query;
  return db(ORDERS_TABLE).where({ id }).first();
}

async function updateById(id, data, trx) {
  const query = db(ORDERS_TABLE).where({ id }).update(data);
  if (trx) query.transacting(trx);
  await query;
  return db(ORDERS_TABLE).where({ id }).first();
}

// --- Order Items ---

async function findItemById(id) {
  return db(ITEMS_TABLE).where({ id }).first();
}

async function listItemsByOrderId(order_id) {
  return db(ITEMS_TABLE).where({ order_id });
}

async function createItem(data, trx) {
  const query = db(ITEMS_TABLE).insert(data);
  if (trx) query.transacting(trx);
  const [id] = await query;
  return db(ITEMS_TABLE).where({ id }).first();
}

async function bulkCreateItems(items, trx) {
  const query = db(ITEMS_TABLE).insert(items);
  if (trx) query.transacting(trx);
  return query;
}

// --- Order Status History ---

async function listStatusHistory(order_id) {
  return db(HISTORY_TABLE)
    .where({ order_id })
    .orderBy('created_at', 'asc');
}

async function createStatusHistory(data, trx) {
  const query = db(HISTORY_TABLE).insert(data);
  if (trx) query.transacting(trx);
  const [id] = await query;
  return db(HISTORY_TABLE).where({ id }).first();
}

// --- Order Tracking ---

async function findTrackingByOrderId(order_id) {
  return db(TRACKING_TABLE).where({ order_id }).first();
}

async function upsertTracking(data, trx) {
  const existing = await db(TRACKING_TABLE).where({ order_id: data.order_id }).first();
  let query;
  if (existing) {
    query = db(TRACKING_TABLE).where({ order_id: data.order_id }).update(data);
  } else {
    query = db(TRACKING_TABLE).insert(data);
  }
  if (trx) query.transacting(trx);
  await query;
  return db(TRACKING_TABLE).where({ order_id: data.order_id }).first();
}

module.exports = {
  findById,
  findByOrderNumber,
  listByUserId,
  countByUserId,
  list,
  count,
  create,
  updateById,
  findItemById,
  listItemsByOrderId,
  createItem,
  bulkCreateItems,
  listStatusHistory,
  createStatusHistory,
  findTrackingByOrderId,
  upsertTracking,
};
