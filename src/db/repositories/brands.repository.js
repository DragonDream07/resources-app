const db = require('../client');

const TABLE = 'brands';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findBySlug(slug) {
  return db(TABLE).where({ slug }).first();
}

async function findByName(name) {
  return db(TABLE).where({ name }).first();
}

async function list({ limit = 20, offset = 0, is_active } = {}) {
  const query = db(TABLE).orderBy('name', 'asc');
  if (is_active !== undefined) {
    query.where({ is_active });
  }
  return query.limit(limit).offset(offset);
}

async function count({ is_active } = {}) {
  const query = db(TABLE).count('id as total');
  if (is_active !== undefined) {
    query.where({ is_active });
  }
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

async function deleteById(id) {
  return db(TABLE).where({ id }).delete();
}

module.exports = {
  findById,
  findBySlug,
  findByName,
  list,
  count,
  create,
  updateById,
  deleteById,
};
