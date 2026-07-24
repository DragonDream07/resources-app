const db = require('../client');

const TABLE = 'skus';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findBySku(sku) {
  return db(TABLE).where({ sku }).first();
}

async function listByProductId(product_id) {
  return db(TABLE).where({ product_id }).orderBy('created_at', 'asc');
}

async function listByIds(ids) {
  return db(TABLE).whereIn('id', ids);
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

async function deleteByProductId(product_id) {
  return db(TABLE).where({ product_id }).delete();
}

/**
 * Atomically decrement stock for a SKU.
 * Only decrements if stock_quantity >= quantity.
 * Returns number of affected rows (1 = success, 0 = insufficient stock).
 */
async function decrementStock(id, quantity, trx) {
  const query = db(TABLE)
    .where('id', id)
    .where('stock_quantity', '>=', quantity)
    .decrement('stock_quantity', quantity);
  if (trx) query.transacting(trx);
  return query;
}

/**
 * Atomically increment stock for a SKU (used for cancellation/release).
 */
async function incrementStock(id, quantity, trx) {
  const query = db(TABLE)
    .where('id', id)
    .increment('stock_quantity', quantity);
  if (trx) query.transacting(trx);
  return query;
}

/**
 * Lock a SKU row for update within a transaction.
 */
async function findByIdForUpdate(id, trx) {
  return db(TABLE).where({ id }).forUpdate().first().transacting(trx);
}

module.exports = {
  findById,
  findBySku,
  listByProductId,
  listByIds,
  create,
  updateById,
  deleteById,
  deleteByProductId,
  decrementStock,
  incrementStock,
  findByIdForUpdate,
};
