const db = require('../../db');
const { NotFoundError, ConflictError, BadRequestError } = require('../../utils/errors');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildPaginationMeta(total, page, limit) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// ─── Products ────────────────────────────────────────────────────────────────

async function listProducts(query) {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const conditions = ['p.deleted_at IS NULL'];
  const values = [];
  let idx = 1;

  if (query.categoryId) {
    conditions.push(`p.category_id = $${idx++}`);
    values.push(query.categoryId);
  }
  if (query.brandId) {
    conditions.push(`p.brand_id = $${idx++}`);
    values.push(query.brandId);
  }
  if (query.search) {
    conditions.push(`(p.name ILIKE $${idx} OR p.description ILIKE $${idx})`);
    values.push(`%${query.search}%`);
    idx++;
  }
  if (query.minPrice !== undefined) {
    conditions.push(`p.base_price >= $${idx++}`);
    values.push(query.minPrice);
  }
  if (query.maxPrice !== undefined) {
    conditions.push(`p.base_price <= $${idx++}`);
    values.push(query.maxPrice);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const sortField = query.sortBy === 'price' ? 'p.base_price' : query.sortBy === 'name' ? 'p.name' : 'p.created_at';
  const sortDir = query.sortDir === 'asc' ? 'ASC' : 'DESC';

  const countResult = await db.query(
    `SELECT COUNT(*) FROM products p ${where}`,
    values
  );
  const total = parseInt(countResult.rows[0].count, 10);

  const result = await db.query(
    `SELECT p.*, b.name AS brand_name, c.name AS category_name
     FROM products p
     LEFT JOIN brands b ON b.id = p.brand_id
     LEFT JOIN categories c ON c.id = p.category_id
     ${where}
     ORDER BY ${sortField} ${sortDir}
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...values, limit, offset]
  );

  return {
    data: result.rows,
    meta: buildPaginationMeta(total, page, limit),
  };
}

async function getProduct(productId) {
  const result = await db.query(
    `SELECT p.*, b.name AS brand_name, c.name AS category_name
     FROM products p
     LEFT JOIN brands b ON b.id = p.brand_id
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.id = $1 AND p.deleted_at IS NULL`,
    [productId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('Product not found');
  }
  const product = result.rows[0];
  const images = await listProductImages(productId);
  const skus = await listSkus(productId);
  product.images = images;
  product.skus = skus;
  return product;
}

async function createProduct(data) {
  const {
    name,
    description,
    base_price,
    brand_id,
    category_id,
    is_active = true,
    attributes,
  } = data;

  if (brand_id) {
    const brand = await db.query('SELECT id FROM brands WHERE id = $1', [brand_id]);
    if (!brand.rows.length) throw new NotFoundError('Brand not found');
  }
  if (category_id) {
    const cat = await db.query('SELECT id FROM categories WHERE id = $1', [category_id]);
    if (!cat.rows.length) throw new NotFoundError('Category not found');
  }

  const result = await db.query(
    `INSERT INTO products (name, description, base_price, brand_id, category_id, is_active, attributes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [name, description || null, base_price, brand_id || null, category_id || null, is_active, attributes ? JSON.stringify(attributes) : null]
  );
  return result.rows[0];
}

async function updateProduct(productId, data) {
  const existing = await db.query('SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL', [productId]);
  if (!existing.rows.length) throw new NotFoundError('Product not found');

  if (data.brand_id) {
    const brand = await db.query('SELECT id FROM brands WHERE id = $1', [data.brand_id]);
    if (!brand.rows.length) throw new NotFoundError('Brand not found');
  }
  if (data.category_id) {
    const cat = await db.query('SELECT id FROM categories WHERE id = $1', [data.category_id]);
    if (!cat.rows.length) throw new NotFoundError('Category not found');
  }

  const fields = [];
  const values = [];
  let idx = 1;

  const allowed = ['name', 'description', 'base_price', 'brand_id', 'category_id', 'is_active', 'attributes'];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(key === 'attributes' ? JSON.stringify(data[key]) : data[key]);
    }
  }

  if (!fields.length) throw new BadRequestError('No fields to update');

  fields.push(`updated_at = NOW()`);
  values.push(productId);

  const result = await db.query(
    `UPDATE products SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return result.rows[0];
}

async function deleteProduct(productId) {
  const existing = await db.query('SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL', [productId]);
  if (!existing.rows.length) throw new NotFoundError('Product not found');
  await db.query('UPDATE products SET deleted_at = NOW() WHERE id = $1', [productId]);
}

// ─── SKUs ────────────────────────────────────────────────────────────────────

async function listSkus(productId) {
  const product = await db.query('SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL', [productId]);
  if (!product.rows.length) throw new NotFoundError('Product not found');

  const result = await db.query(
    `SELECT * FROM skus WHERE product_id = $1 AND deleted_at IS NULL ORDER BY created_at ASC`,
    [productId]
  );
  return result.rows;
}

async function getSku(productId, skuId) {
  const product = await db.query('SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL', [productId]);
  if (!product.rows.length) throw new NotFoundError('Product not found');

  const result = await db.query(
    `SELECT * FROM skus WHERE id = $1 AND product_id = $2 AND deleted_at IS NULL`,
    [skuId, productId]
  );
  if (!result.rows.length) throw new NotFoundError('SKU not found');
  return result.rows[0];
}

async function createSku(productId, data) {
  const product = await db.query('SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL', [productId]);
  if (!product.rows.length) throw new NotFoundError('Product not found');

  const { sku_code, price, stock_quantity, attributes, is_active = true } = data;

  const existing = await db.query('SELECT id FROM skus WHERE sku_code = $1', [sku_code]);
  if (existing.rows.length) throw new ConflictError('SKU code already exists');

  const result = await db.query(
    `INSERT INTO skus (product_id, sku_code, price, stock_quantity, attributes, is_active)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [productId, sku_code, price, stock_quantity || 0, attributes ? JSON.stringify(attributes) : null, is_active]
  );
  return result.rows[0];
}

async function updateSku(productId, skuId, data) {
  const product = await db.query('SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL', [productId]);
  if (!product.rows.length) throw new NotFoundError('Product not found');

  const existing = await db.query('SELECT id FROM skus WHERE id = $1 AND product_id = $2 AND deleted_at IS NULL', [skuId, productId]);
  if (!existing.rows.length) throw new NotFoundError('SKU not found');

  if (data.sku_code) {
    const conflict = await db.query('SELECT id FROM skus WHERE sku_code = $1 AND id != $2', [data.sku_code, skuId]);
    if (conflict.rows.length) throw new ConflictError('SKU code already exists');
  }

  const fields = [];
  const values = [];
  let idx = 1;

  const allowed = ['sku_code', 'price', 'stock_quantity', 'attributes', 'is_active'];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(key === 'attributes' ? JSON.stringify(data[key]) : data[key]);
    }
  }

  if (!fields.length) throw new BadRequestError('No fields to update');

  fields.push(`updated_at = NOW()`);
  values.push(skuId);

  const result = await db.query(
    `UPDATE skus SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return result.rows[0];
}

async function deleteSku(productId, skuId) {
  const product = await db.query('SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL', [productId]);
  if (!product.rows.length) throw new NotFoundError('Product not found');

  const existing = await db.query('SELECT id FROM skus WHERE id = $1 AND product_id = $2 AND deleted_at IS NULL', [skuId, productId]);
  if (!existing.rows.length) throw new NotFoundError('SKU not found');

  await db.query('UPDATE skus SET deleted_at = NOW() WHERE id = $1', [skuId]);
}

// ─── Product Images ──────────────────────────────────────────────────────────

async function listProductImages(productId) {
  const product = await db.query('SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL', [productId]);
  if (!product.rows.length) throw new NotFoundError('Product not found');

  const result = await db.query(
    `SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC, created_at ASC`,
    [productId]
  );
  return result.rows;
}

async function addProductImage(productId, data) {
  const product = await db.query('SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL', [productId]);
  if (!product.rows.length) throw new NotFoundError('Product not found');

  const { url, alt_text, sort_order, is_primary = false } = data;

  if (is_primary) {
    await db.query('UPDATE product_images SET is_primary = false WHERE product_id = $1', [productId]);
  }

  const result = await db.query(
    `INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [productId, url, alt_text || null, sort_order || 0, is_primary]
  );
  return result.rows[0];
}

async function deleteProductImage(productId, imageId) {
  const product = await db.query('SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL', [productId]);
  if (!product.rows.length) throw new NotFoundError('Product not found');

  const existing = await db.query('SELECT id FROM product_images WHERE id = $1 AND product_id = $2', [imageId, productId]);
  if (!existing.rows.length) throw new NotFoundError('Image not found');

  await db.query('DELETE FROM product_images WHERE id = $1', [imageId]);
}

// ─── Categories ──────────────────────────────────────────────────────────────

async function listCategories() {
  const result = await db.query(
    `SELECT * FROM categories WHERE deleted_at IS NULL ORDER BY name ASC`
  );
  return result.rows;
}

async function getCategory(categoryId) {
  const result = await db.query(
    `SELECT * FROM categories WHERE id = $1 AND deleted_at IS NULL`,
    [categoryId]
  );
  if (!result.rows.length) throw new NotFoundError('Category not found');
  return result.rows[0];
}

async function createCategory(data) {
  const { name, description, parent_id, image_url, is_active = true } = data;

  const existing = await db.query('SELECT id FROM categories WHERE name = $1 AND deleted_at IS NULL', [name]);
  if (existing.rows.length) throw new ConflictError('Category name already exists');

  if (parent_id) {
    const parent = await db.query('SELECT id FROM categories WHERE id = $1 AND deleted_at IS NULL', [parent_id]);
    if (!parent.rows.length) throw new NotFoundError('Parent category not found');
  }

  const result = await db.query(
    `INSERT INTO categories (name, description, parent_id, image_url, is_active)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, description || null, parent_id || null, image_url || null, is_active]
  );
  return result.rows[0];
}

async function updateCategory(categoryId, data) {
  const existing = await db.query('SELECT id FROM categories WHERE id = $1 AND deleted_at IS NULL', [categoryId]);
  if (!existing.rows.length) throw new NotFoundError('Category not found');

  if (data.name) {
    const conflict = await db.query('SELECT id FROM categories WHERE name = $1 AND id != $2 AND deleted_at IS NULL', [data.name, categoryId]);
    if (conflict.rows.length) throw new ConflictError('Category name already exists');
  }

  if (data.parent_id) {
    if (data.parent_id === categoryId) throw new BadRequestError('Category cannot be its own parent');
    const parent = await db.query('SELECT id FROM categories WHERE id = $1 AND deleted_at IS NULL', [data.parent_id]);
    if (!parent.rows.length) throw new NotFoundError('Parent category not found');
  }

  const fields = [];
  const values = [];
  let idx = 1;

  const allowed = ['name', 'description', 'parent_id', 'image_url', 'is_active'];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(data[key]);
    }
  }

  if (!fields.length) throw new BadRequestError('No fields to update');

  fields.push(`updated_at = NOW()`);
  values.push(categoryId);

  const result = await db.query(
    `UPDATE categories SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return result.rows[0];
}

async function deleteCategory(categoryId) {
  const existing = await db.query('SELECT id FROM categories WHERE id = $1 AND deleted_at IS NULL', [categoryId]);
  if (!existing.rows.length) throw new NotFoundError('Category not found');

  const children = await db.query('SELECT id FROM categories WHERE parent_id = $1 AND deleted_at IS NULL', [categoryId]);
  if (children.rows.length) throw new ConflictError('Cannot delete category with subcategories');

  const products = await db.query('SELECT id FROM products WHERE category_id = $1 AND deleted_at IS NULL LIMIT 1', [categoryId]);
  if (products.rows.length) throw new ConflictError('Cannot delete category with associated products');

  await db.query('UPDATE categories SET deleted_at = NOW() WHERE id = $1', [categoryId]);
}

async function listCategoryProducts(categoryId, query) {
  const category = await db.query('SELECT id FROM categories WHERE id = $1 AND deleted_at IS NULL', [categoryId]);
  if (!category.rows.length) throw new NotFoundError('Category not found');

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const conditions = ['p.category_id = $1', 'p.deleted_at IS NULL'];
  const values = [categoryId];
  let idx = 2;

  if (query.brandId) {
    conditions.push(`p.brand_id = $${idx++}`);
    values.push(query.brandId);
  }
  if (query.search) {
    conditions.push(`(p.name ILIKE $${idx} OR p.description ILIKE $${idx})`);
    values.push(`%${query.search}%`);
    idx++;
  }

  const where = `WHERE ${conditions.join(' AND ')}`;
  const sortField = query.sortBy === 'price' ? 'p.base_price' : query.sortBy === 'name' ? 'p.name' : 'p.created_at';
  const sortDir = query.sortDir === 'asc' ? 'ASC' : 'DESC';

  const countResult = await db.query(`SELECT COUNT(*) FROM products p ${where}`, values);
  const total = parseInt(countResult.rows[0].count, 10);

  const result = await db.query(
    `SELECT p.*, b.name AS brand_name
     FROM products p
     LEFT JOIN brands b ON b.id = p.brand_id
     ${where}
     ORDER BY ${sortField} ${sortDir}
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...values, limit, offset]
  );

  return {
    data: result.rows,
    meta: buildPaginationMeta(total, page, limit),
  };
}

// ─── Brands ──────────────────────────────────────────────────────────────────

async function listBrands() {
  const result = await db.query(
    `SELECT * FROM brands WHERE deleted_at IS NULL ORDER BY name ASC`
  );
  return result.rows;
}

async function getBrand(brandId) {
  const result = await db.query(
    `SELECT * FROM brands WHERE id = $1 AND deleted_at IS NULL`,
    [brandId]
  );
  if (!result.rows.length) throw new NotFoundError('Brand not found');

  const products = await db.query(
    `SELECT p.id, p.name, p.base_price,
       (SELECT pi.url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1) AS image_url
     FROM products p
     WHERE p.brand_id = $1 AND p.deleted_at IS NULL
     ORDER BY p.created_at DESC`,
    [brandId]
  );

  const brand = result.rows[0];
  brand.products = products.rows;
  return brand;
}

async function createBrand(data) {
  const { name, description, logo_url, is_active = true } = data;

  const existing = await db.query('SELECT id FROM brands WHERE name = $1 AND deleted_at IS NULL', [name]);
  if (existing.rows.length) throw new ConflictError('Brand name already exists');

  const result = await db.query(
    `INSERT INTO brands (name, description, logo_url, is_active)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description || null, logo_url || null, is_active]
  );
  return result.rows[0];
}

async function updateBrand(brandId, data) {
  const existing = await db.query('SELECT id FROM brands WHERE id = $1 AND deleted_at IS NULL', [brandId]);
  if (!existing.rows.length) throw new NotFoundError('Brand not found');

  if (data.name) {
    const conflict = await db.query('SELECT id FROM brands WHERE name = $1 AND id != $2 AND deleted_at IS NULL', [data.name, brandId]);
    if (conflict.rows.length) throw new ConflictError('Brand name already exists');
  }

  const fields = [];
  const values = [];
  let idx = 1;

  const allowed = ['name', 'description', 'logo_url', 'is_active'];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(data[key]);
    }
  }

  if (!fields.length) throw new BadRequestError('No fields to update');

  fields.push(`updated_at = NOW()`);
  values.push(brandId);

  const result = await db.query(
    `UPDATE brands SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return result.rows[0];
}

async function deleteBrand(brandId) {
  const existing = await db.query('SELECT id FROM brands WHERE id = $1 AND deleted_at IS NULL', [brandId]);
  if (!existing.rows.length) throw new NotFoundError('Brand not found');

  const products = await db.query('SELECT id FROM products WHERE brand_id = $1 AND deleted_at IS NULL LIMIT 1', [brandId]);
  if (products.rows.length) throw new ConflictError('Cannot delete brand with associated products');

  await db.query('UPDATE brands SET deleted_at = NOW() WHERE id = $1', [brandId]);
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listSkus,
  getSku,
  createSku,
  updateSku,
  deleteSku,
  listProductImages,
  addProductImage,
  deleteProductImage,
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  listCategoryProducts,
  listBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
