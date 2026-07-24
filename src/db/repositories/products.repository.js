const db = require('../client');

const PRODUCTS_TABLE = 'products';
const IMAGES_TABLE = 'product_images';

async function findById(id) {
  return db(PRODUCTS_TABLE).where({ id }).first();
}

async function findBySlug(slug) {
  return db(PRODUCTS_TABLE).where({ slug }).first();
}

async function list({ limit = 20, offset = 0, category_id, brand_id, is_active, ids } = {}) {
  const query = db(PRODUCTS_TABLE).orderBy('created_at', 'desc');
  if (category_id !== undefined) query.where({ category_id });
  if (brand_id !== undefined) query.where({ brand_id });
  if (is_active !== undefined) query.where({ is_active });
  if (ids && ids.length) query.whereIn('id', ids);
  return query.limit(limit).offset(offset);
}

async function listByCategoryIds(categoryIds, { limit = 20, offset = 0, is_active } = {}) {
  const query = db(PRODUCTS_TABLE)
    .whereIn('category_id', categoryIds)
    .orderBy('created_at', 'desc');
  if (is_active !== undefined) query.where({ is_active });
  return query.limit(limit).offset(offset);
}

async function count({ category_id, brand_id, is_active, ids, categoryIds } = {}) {
  const query = db(PRODUCTS_TABLE).count('id as total');
  if (category_id !== undefined) query.where({ category_id });
  if (brand_id !== undefined) query.where({ brand_id });
  if (is_active !== undefined) query.where({ is_active });
  if (ids && ids.length) query.whereIn('id', ids);
  if (categoryIds && categoryIds.length) query.whereIn('category_id', categoryIds);
  const [{ total }] = await query;
  return Number(total);
}

async function create(data) {
  const [id] = await db(PRODUCTS_TABLE).insert(data);
  return findById(id);
}

async function updateById(id, data) {
  await db(PRODUCTS_TABLE).where({ id }).update(data);
  return findById(id);
}

async function deleteById(id) {
  return db(PRODUCTS_TABLE).where({ id }).delete();
}

// Product Images
async function findImageById(id) {
  return db(IMAGES_TABLE).where({ id }).first();
}

async function listImagesByProductId(product_id) {
  return db(IMAGES_TABLE).where({ product_id }).orderBy('sort_order', 'asc');
}

async function addImage(data) {
  const [id] = await db(IMAGES_TABLE).insert(data);
  return findImageById(id);
}

async function deleteImageById(id) {
  return db(IMAGES_TABLE).where({ id }).delete();
}

async function deleteImagesByProductId(product_id) {
  return db(IMAGES_TABLE).where({ product_id }).delete();
}

module.exports = {
  findById,
  findBySlug,
  list,
  listByCategoryIds,
  count,
  create,
  updateById,
  deleteById,
  findImageById,
  listImagesByProductId,
  addImage,
  deleteImageById,
  deleteImagesByProductId,
};
