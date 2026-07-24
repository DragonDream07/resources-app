const db = require('../client');

const CARTS_TABLE = 'carts';
const ITEMS_TABLE = 'cart_items';

// --- Cart ---

async function findCartById(id) {
  return db(CARTS_TABLE).where({ id }).first();
}

async function findCartByUserId(user_id) {
  return db(CARTS_TABLE).where({ user_id }).first();
}

async function findCartByGuestToken(guest_token) {
  return db(CARTS_TABLE).where({ guest_token }).first();
}

async function createCart(data) {
  const [id] = await db(CARTS_TABLE).insert(data);
  return findCartById(id);
}

async function updateCartById(id, data) {
  await db(CARTS_TABLE).where({ id }).update(data);
  return findCartById(id);
}

async function deleteCartById(id) {
  return db(CARTS_TABLE).where({ id }).delete();
}

// --- Cart Items ---

async function findItemById(id) {
  return db(ITEMS_TABLE).where({ id }).first();
}

async function findItemByCartAndSku(cart_id, sku_id) {
  return db(ITEMS_TABLE).where({ cart_id, sku_id }).first();
}

async function listItemsByCartId(cart_id) {
  return db(ITEMS_TABLE).where({ cart_id }).orderBy('created_at', 'asc');
}

async function addItem(data) {
  const [id] = await db(ITEMS_TABLE).insert(data);
  return findItemById(id);
}

async function updateItemById(id, data) {
  await db(ITEMS_TABLE).where({ id }).update(data);
  return findItemById(id);
}

async function deleteItemById(id) {
  return db(ITEMS_TABLE).where({ id }).delete();
}

async function clearCartItems(cart_id) {
  return db(ITEMS_TABLE).where({ cart_id }).delete();
}

module.exports = {
  findCartById,
  findCartByUserId,
  findCartByGuestToken,
  createCart,
  updateCartById,
  deleteCartById,
  findItemById,
  findItemByCartAndSku,
  listItemsByCartId,
  addItem,
  updateItemById,
  deleteItemById,
  clearCartItems,
};
