const db = require('../client');

const TABLE = 'categories';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findBySlug(slug) {
  return db(TABLE).where({ slug }).first();
}

async function listAll({ is_active } = {}) {
  const query = db(TABLE).orderBy('sort_order', 'asc');
  if (is_active !== undefined) {
    query.where({ is_active });
  }
  return query;
}

async function listRoots({ is_active } = {}) {
  const query = db(TABLE).whereNull('parent_id').orderBy('sort_order', 'asc');
  if (is_active !== undefined) {
    query.where({ is_active });
  }
  return query;
}

async function listChildren(parent_id, { is_active } = {}) {
  const query = db(TABLE).where({ parent_id }).orderBy('sort_order', 'asc');
  if (is_active !== undefined) {
    query.where({ is_active });
  }
  return query;
}

async function getDescendantIds(id) {
  const all = await listAll();
  const map = {};
  all.forEach((c) => {
    map[c.id] = c;
  });

  const result = [];
  const queue = [id];
  while (queue.length) {
    const current = queue.shift();
    const children = all.filter((c) => c.parent_id === current);
    children.forEach((c) => {
      result.push(c.id);
      queue.push(c.id);
    });
  }
  return result;
}

async function getAncestors(id) {
  const ancestors = [];
  let current = await findById(id);
  while (current && current.parent_id) {
    current = await findById(current.parent_id);
    if (current) ancestors.unshift(current);
  }
  return ancestors;
}

async function create(data) {
  const [newId] = await db(TABLE).insert(data);
  return findById(newId);
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
  listAll,
  listRoots,
  listChildren,
  getDescendantIds,
  getAncestors,
  create,
  updateById,
  deleteById,
};
