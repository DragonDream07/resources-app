const db = require('../../config/db');
const { AppError } = require('../../utils/AppError');

/**
 * Verify the caller is allowed to access/modify the cart.
 * Allows access if the cart belongs to the user or matches the guestId.
 */
async function _assertCartAccess(cart, { userId, guestId }) {
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }
  if (userId && cart.user_id && String(cart.user_id) !== String(userId)) {
    throw new AppError('Access denied to this cart', 403);
  }
  if (!userId && guestId && cart.guest_id && String(cart.guest_id) !== String(guestId)) {
    throw new AppError('Access denied to this cart', 403);
  }
}

/**
 * Build a full cart response including items and totals.
 */
async function _buildCartResponse(cartId) {
  const cartResult = await db.query(
    `SELECT c.*, pc.code AS promo_code, pc.discount_type, pc.discount_value
     FROM carts c
     LEFT JOIN promo_codes pc ON pc.id = c.promo_code_id
     WHERE c.id = $1`,
    [cartId]
  );
  const cart = cartResult.rows[0];
  if (!cart) return null;

  const itemsResult = await db.query(
    `SELECT ci.*, s.price, s.stock_quantity, s.sku_code,
            p.name AS product_name, p.id AS product_id,
            pi.url AS image_url
     FROM cart_items ci
     JOIN skus s ON s.id = ci.sku_id
     JOIN products p ON p.id = s.product_id
     LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = true
     WHERE ci.cart_id = $1`,
    [cartId]
  );

  const items = itemsResult.rows;
  let subtotal = 0;
  for (const item of items) {
    item.line_total = parseFloat(item.price) * item.quantity;
    subtotal += item.line_total;
  }

  let discount = 0;
  if (cart.discount_type && cart.discount_value) {
    if (cart.discount_type === 'percentage') {
      discount = (subtotal * parseFloat(cart.discount_value)) / 100;
    } else if (cart.discount_type === 'fixed') {
      discount = parseFloat(cart.discount_value);
    }
    discount = Math.min(discount, subtotal);
  }

  const total = subtotal - discount;

  return {
    id: cart.id,
    userId: cart.user_id,
    guestId: cart.guest_id,
    promoCode: cart.promo_code || null,
    discountType: cart.discount_type || null,
    discountValue: cart.discount_value || null,
    subtotal: parseFloat(subtotal.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    items,
    createdAt: cart.created_at,
    updatedAt: cart.updated_at,
  };
}

/**
 * Create a new cart for a guest or authenticated user.
 * If userId is provided and a guest cart exists (guestId), merges them.
 */
async function createCart({ userId, guestId }) {
  // If authenticated user already has an active cart, return it
  if (userId) {
    const existing = await db.query(
      `SELECT id FROM carts WHERE user_id = $1 AND status = 'active' LIMIT 1`,
      [userId]
    );
    if (existing.rows.length > 0) {
      return _buildCartResponse(existing.rows[0].id);
    }
  }

  // If guestId provided and a guest cart exists, merge on login or return
  if (guestId && userId) {
    const guestCart = await db.query(
      `SELECT id FROM carts WHERE guest_id = $1 AND status = 'active' LIMIT 1`,
      [guestId]
    );
    if (guestCart.rows.length > 0) {
      return mergeGuestCart({ guestCartId: guestCart.rows[0].id, userId });
    }
  }

  const result = await db.query(
    `INSERT INTO carts (user_id, guest_id, status, created_at, updated_at)
     VALUES ($1, $2, 'active', NOW(), NOW())
     RETURNING id`,
    [userId || null, guestId || null]
  );

  return _buildCartResponse(result.rows[0].id);
}

/**
 * Retrieve a cart by ID.
 */
async function getCart({ cartId, userId, guestId }) {
  const result = await db.query(`SELECT * FROM carts WHERE id = $1`, [cartId]);
  const cart = result.rows[0];
  await _assertCartAccess(cart, { userId, guestId });
  return _buildCartResponse(cartId);
}

/**
 * Add an item to the cart, enforcing stock limits.
 */
async function addItem({ cartId, skuId, quantity, userId, guestId }) {
  const cartResult = await db.query(`SELECT * FROM carts WHERE id = $1`, [cartId]);
  const cart = cartResult.rows[0];
  await _assertCartAccess(cart, { userId, guestId });

  // Validate SKU exists and has sufficient stock
  const skuResult = await db.query(
    `SELECT id, stock_quantity, price FROM skus WHERE id = $1`,
    [skuId]
  );
  if (skuResult.rows.length === 0) {
    throw new AppError('SKU not found', 404);
  }
  const sku = skuResult.rows[0];

  // Check if item already exists in cart
  const existingItem = await db.query(
    `SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND sku_id = $2`,
    [cartId, skuId]
  );

  const currentQty = existingItem.rows.length > 0 ? existingItem.rows[0].quantity : 0;
  const newQty = currentQty + quantity;

  if (newQty > sku.stock_quantity) {
    throw new AppError(
      `Insufficient stock. Only ${sku.stock_quantity} units available.`,
      422
    );
  }

  if (existingItem.rows.length > 0) {
    await db.query(
      `UPDATE cart_items SET quantity = $1, updated_at = NOW()
       WHERE cart_id = $2 AND sku_id = $3`,
      [newQty, cartId, skuId]
    );
  } else {
    await db.query(
      `INSERT INTO cart_items (cart_id, sku_id, quantity, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())`,
      [cartId, skuId, quantity]
    );
  }

  await db.query(`UPDATE carts SET updated_at = NOW() WHERE id = $1`, [cartId]);

  return _buildCartResponse(cartId);
}

/**
 * Update quantity of an existing cart item.
 */
async function updateItem({ cartId, itemId, quantity, userId, guestId }) {
  const cartResult = await db.query(`SELECT * FROM carts WHERE id = $1`, [cartId]);
  const cart = cartResult.rows[0];
  await _assertCartAccess(cart, { userId, guestId });

  const itemResult = await db.query(
    `SELECT ci.*, s.stock_quantity FROM cart_items ci
     JOIN skus s ON s.id = ci.sku_id
     WHERE ci.id = $1 AND ci.cart_id = $2`,
    [itemId, cartId]
  );

  if (itemResult.rows.length === 0) {
    throw new AppError('Cart item not found', 404);
  }

  const item = itemResult.rows[0];

  if (quantity > item.stock_quantity) {
    throw new AppError(
      `Insufficient stock. Only ${item.stock_quantity} units available.`,
      422
    );
  }

  if (quantity <= 0) {
    await db.query(`DELETE FROM cart_items WHERE id = $1`, [itemId]);
  } else {
    await db.query(
      `UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2`,
      [quantity, itemId]
    );
  }

  await db.query(`UPDATE carts SET updated_at = NOW() WHERE id = $1`, [cartId]);

  return _buildCartResponse(cartId);
}

/**
 * Remove an item from the cart.
 */
async function removeItem({ cartId, itemId, userId, guestId }) {
  const cartResult = await db.query(`SELECT * FROM carts WHERE id = $1`, [cartId]);
  const cart = cartResult.rows[0];
  await _assertCartAccess(cart, { userId, guestId });

  const itemResult = await db.query(
    `SELECT id FROM cart_items WHERE id = $1 AND cart_id = $2`,
    [itemId, cartId]
  );

  if (itemResult.rows.length === 0) {
    throw new AppError('Cart item not found', 404);
  }

  await db.query(`DELETE FROM cart_items WHERE id = $1`, [itemId]);
  await db.query(`UPDATE carts SET updated_at = NOW() WHERE id = $1`, [cartId]);

  return _buildCartResponse(cartId);
}

/**
 * Apply a promo code to the cart.
 */
async function applyPromo({ cartId, promoCode, userId, guestId }) {
  const cartResult = await db.query(`SELECT * FROM carts WHERE id = $1`, [cartId]);
  const cart = cartResult.rows[0];
  await _assertCartAccess(cart, { userId, guestId });

  const promoResult = await db.query(
    `SELECT id, code, discount_type, discount_value, is_active, valid_from, valid_until, usage_limit, usage_count
     FROM promo_codes
     WHERE code = $1`,
    [promoCode]
  );

  if (promoResult.rows.length === 0) {
    throw new AppError('Invalid promo code', 422);
  }

  const promo = promoResult.rows[0];

  if (!promo.is_active) {
    throw new AppError('Promo code is inactive', 422);
  }

  const now = new Date();
  if (promo.valid_from && new Date(promo.valid_from) > now) {
    throw new AppError('Promo code is not yet valid', 422);
  }
  if (promo.valid_until && new Date(promo.valid_until) < now) {
    throw new AppError('Promo code has expired', 422);
  }
  if (promo.usage_limit !== null && promo.usage_count >= promo.usage_limit) {
    throw new AppError('Promo code usage limit reached', 422);
  }

  await db.query(
    `UPDATE carts SET promo_code_id = $1, updated_at = NOW() WHERE id = $2`,
    [promo.id, cartId]
  );

  return _buildCartResponse(cartId);
}

/**
 * Remove an applied promo code from the cart.
 */
async function removePromo({ cartId, userId, guestId }) {
  const cartResult = await db.query(`SELECT * FROM carts WHERE id = $1`, [cartId]);
  const cart = cartResult.rows[0];
  await _assertCartAccess(cart, { userId, guestId });

  if (!cart.promo_code_id) {
    throw new AppError('No promo code applied to this cart', 422);
  }

  await db.query(
    `UPDATE carts SET promo_code_id = NULL, updated_at = NOW() WHERE id = $1`,
    [cartId]
  );

  return _buildCartResponse(cartId);
}

/**
 * Merge a guest cart into an authenticated user's cart.
 * Items from the guest cart are merged into the user cart, respecting stock limits.
 */
async function mergeGuestCart({ guestCartId, userId }) {
  // Find or create the user's active cart
  let userCartId;
  const userCartResult = await db.query(
    `SELECT id FROM carts WHERE user_id = $1 AND status = 'active' LIMIT 1`,
    [userId]
  );

  if (userCartResult.rows.length > 0) {
    userCartId = userCartResult.rows[0].id;
  } else {
    const newCart = await db.query(
      `INSERT INTO carts (user_id, status, created_at, updated_at)
       VALUES ($1, 'active', NOW(), NOW()) RETURNING id`,
      [userId]
    );
    userCartId = newCart.rows[0].id;
  }

  // Get guest cart items
  const guestItems = await db.query(
    `SELECT ci.sku_id, ci.quantity, s.stock_quantity
     FROM cart_items ci
     JOIN skus s ON s.id = ci.sku_id
     WHERE ci.cart_id = $1`,
    [guestCartId]
  );

  for (const guestItem of guestItems.rows) {
    const existingItem = await db.query(
      `SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND sku_id = $2`,
      [userCartId, guestItem.sku_id]
    );

    const currentQty = existingItem.rows.length > 0 ? existingItem.rows[0].quantity : 0;
    const mergedQty = Math.min(currentQty + guestItem.quantity, guestItem.stock_quantity);

    if (existingItem.rows.length > 0) {
      await db.query(
        `UPDATE cart_items SET quantity = $1, updated_at = NOW()
         WHERE cart_id = $2 AND sku_id = $3`,
        [mergedQty, userCartId, guestItem.sku_id]
      );
    } else {
      await db.query(
        `INSERT INTO cart_items (cart_id, sku_id, quantity, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())`,
        [userCartId, guestItem.sku_id, mergedQty]
      );
    }
  }

  // Invalidate the guest cart
  await db.query(
    `UPDATE carts SET status = 'merged', updated_at = NOW() WHERE id = $1`,
    [guestCartId]
  );
  await db.query(`UPDATE carts SET updated_at = NOW() WHERE id = $1`, [userCartId]);

  return _buildCartResponse(userCartId);
}

module.exports = {
  createCart,
  getCart,
  addItem,
  updateItem,
  removeItem,
  applyPromo,
  removePromo,
  mergeGuestCart,
};
