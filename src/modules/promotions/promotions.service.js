const { AppError } = require('../../utils/AppError');
const db = require('../../db');

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Fetch a promo code record by its code string.
 * @param {string} code
 * @returns {Promise<object|null>}
 */
async function findPromoCodeByCode(code) {
  const [rows] = await db.query(
    'SELECT * FROM promo_codes WHERE code = ? LIMIT 1',
    [code.trim().toUpperCase()]
  );
  return rows[0] || null;
}

/**
 * Fetch a promo code record by its primary key.
 * @param {string|number} id
 * @returns {Promise<object|null>}
 */
async function findPromoCodeById(id) {
  const [rows] = await db.query(
    'SELECT * FROM promo_codes WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

/**
 * Count how many times a user has already used a promo code.
 * @param {string|number} promoCodeId
 * @param {string|number} userId
 * @returns {Promise<number>}
 */
async function countUserUsages(promoCodeId, userId) {
  const [rows] = await db.query(
    'SELECT COUNT(*) AS cnt FROM promo_code_usages WHERE promo_code_id = ? AND user_id = ?',
    [promoCodeId, userId]
  );
  return parseInt(rows[0].cnt, 10);
}

/**
 * Fetch the current cart with its items and totals.
 * @param {string|number} cartId
 * @returns {Promise<object|null>}
 */
async function fetchCart(cartId) {
  const [rows] = await db.query(
    'SELECT * FROM carts WHERE id = ? LIMIT 1',
    [cartId]
  );
  return rows[0] || null;
}

// ---------------------------------------------------------------------------
// Eligibility checks
// ---------------------------------------------------------------------------

/**
 * Verify that a promo code passes all eligibility rules.
 * Throws AppError with an appropriate message if any check fails.
 *
 * @param {object} promoCode  - Row from promo_codes table
 * @param {object} cart       - Row from carts table
 * @param {string|number} userId
 */
async function checkEligibility(promoCode, cart, userId) {
  const now = new Date();

  // 1. Active status
  if (promoCode.status !== 'active') {
    throw new AppError('Promo code is not active.', 400);
  }

  // 2. Date range
  if (promoCode.valid_from && new Date(promoCode.valid_from) > now) {
    throw new AppError('Promo code is not yet valid.', 400);
  }
  if (promoCode.valid_until && new Date(promoCode.valid_until) < now) {
    throw new AppError('Promo code has expired.', 400);
  }

  // 3. Global usage limit
  if (
    promoCode.usage_limit !== null &&
    promoCode.usage_limit !== undefined &&
    promoCode.times_used >= promoCode.usage_limit
  ) {
    throw new AppError('Promo code usage limit has been reached.', 400);
  }

  // 4. Per-user usage limit
  if (
    promoCode.per_user_limit !== null &&
    promoCode.per_user_limit !== undefined
  ) {
    const userUsages = await countUserUsages(promoCode.id, userId);
    if (userUsages >= promoCode.per_user_limit) {
      throw new AppError('You have already used this promo code the maximum number of times.', 400);
    }
  }

  // 5. Minimum order value
  if (
    promoCode.min_order_value !== null &&
    promoCode.min_order_value !== undefined &&
    parseFloat(cart.subtotal) < parseFloat(promoCode.min_order_value)
  ) {
    throw new AppError(
      `Minimum order value of ${promoCode.min_order_value} is required to use this promo code.`,
      400
    );
  }
}

// ---------------------------------------------------------------------------
// Discount calculation
// ---------------------------------------------------------------------------

/**
 * Calculate the discount amount for a given promo code and cart subtotal.
 *
 * @param {object} promoCode
 * @param {number} subtotal
 * @returns {number} discountAmount (rounded to 2 decimal places)
 */
function calculateDiscount(promoCode, subtotal) {
  let discount = 0;

  if (promoCode.discount_type === 'percentage') {
    discount = (subtotal * parseFloat(promoCode.discount_value)) / 100;
    if (
      promoCode.max_discount_value !== null &&
      promoCode.max_discount_value !== undefined
    ) {
      discount = Math.min(discount, parseFloat(promoCode.max_discount_value));
    }
  } else if (promoCode.discount_type === 'flat') {
    discount = parseFloat(promoCode.discount_value);
  } else if (promoCode.discount_type === 'free_shipping') {
    // Shipping discount is resolved at checkout; return 0 here and flag it
    discount = 0;
  }

  // Discount cannot exceed the subtotal
  discount = Math.min(discount, subtotal);

  return Math.round(discount * 100) / 100;
}

// ---------------------------------------------------------------------------
// Public service methods
// ---------------------------------------------------------------------------

/**
 * Validate and apply a promo code to a cart.
 *
 * @param {{ cartId: string|number, code: string, userId: string|number }} params
 * @returns {Promise<object>} Updated cart totals with discount info
 */
async function applyPromoCode({ cartId, code, userId }) {
  const promoCode = await findPromoCodeByCode(code);
  if (!promoCode) {
    throw new AppError('Promo code not found.', 404);
  }

  const cart = await fetchCart(cartId);
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }

  await checkEligibility(promoCode, cart, userId);

  const subtotal = parseFloat(cart.subtotal);
  const discountAmount = calculateDiscount(promoCode, subtotal);
  const total = Math.max(0, subtotal - discountAmount);

  // Persist the applied promo to the cart
  await db.query(
    'UPDATE carts SET promo_code_id = ?, discount_amount = ?, total = ? WHERE id = ?',
    [promoCode.id, discountAmount, total, cartId]
  );

  return {
    promoCodeId: promoCode.id,
    code: promoCode.code,
    discountType: promoCode.discount_type,
    discountValue: promoCode.discount_value,
    discountAmount,
    subtotal,
    total,
    isFreeShipping: promoCode.discount_type === 'free_shipping',
  };
}

/**
 * List promo codes with pagination and optional filters.
 *
 * @param {{ page: number, limit: number, status?: string, search?: string }} filters
 * @returns {Promise<object>}
 */
async function listPromoCodes({ page, limit, status, search }) {
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }
  if (search) {
    conditions.push('code LIKE ?');
    params.push(`%${search}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM promo_codes ${where}`,
    params
  );
  const total = parseInt(countRows[0].total, 10);

  const [rows] = await db.query(
    `SELECT * FROM promo_codes ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    data: rows,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Create a new promo code.
 *
 * @param {object} payload
 * @returns {Promise<object>}
 */
async function createPromoCode(payload) {
  const {
    code,
    discount_type,
    discount_value,
    max_discount_value = null,
    min_order_value = null,
    usage_limit = null,
    per_user_limit = null,
    valid_from = null,
    valid_until = null,
    status = 'active',
    description = null,
  } = payload;

  const normalizedCode = code.trim().toUpperCase();

  // Ensure code uniqueness
  const existing = await findPromoCodeByCode(normalizedCode);
  if (existing) {
    throw new AppError('A promo code with this code already exists.', 409);
  }

  const [result] = await db.query(
    `INSERT INTO promo_codes
      (code, discount_type, discount_value, max_discount_value, min_order_value,
       usage_limit, per_user_limit, valid_from, valid_until, status, description, times_used)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      normalizedCode,
      discount_type,
      discount_value,
      max_discount_value,
      min_order_value,
      usage_limit,
      per_user_limit,
      valid_from,
      valid_until,
      status,
      description,
    ]
  );

  return getPromoCodeById(result.insertId);
}

/**
 * Get a promo code by its ID.
 *
 * @param {string|number} promoCodeId
 * @returns {Promise<object>}
 */
async function getPromoCodeById(promoCodeId) {
  const promoCode = await findPromoCodeById(promoCodeId);
  if (!promoCode) {
    throw new AppError('Promo code not found.', 404);
  }
  return promoCode;
}

/**
 * Update an existing promo code.
 *
 * @param {string|number} promoCodeId
 * @param {object} payload
 * @returns {Promise<object>}
 */
async function updatePromoCode(promoCodeId, payload) {
  const promoCode = await findPromoCodeById(promoCodeId);
  if (!promoCode) {
    throw new AppError('Promo code not found.', 404);
  }

  const allowedFields = [
    'discount_type',
    'discount_value',
    'max_discount_value',
    'min_order_value',
    'usage_limit',
    'per_user_limit',
    'valid_from',
    'valid_until',
    'status',
    'description',
  ];

  if (payload.code) {
    const normalizedCode = payload.code.trim().toUpperCase();
    if (normalizedCode !== promoCode.code) {
      const existing = await findPromoCodeByCode(normalizedCode);
      if (existing) {
        throw new AppError('A promo code with this code already exists.', 409);
      }
      allowedFields.push('code');
      payload.code = normalizedCode;
    }
  }

  const updates = [];
  const params = [];

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      updates.push(`${field} = ?`);
      params.push(payload[field]);
    }
  }

  if (updates.length === 0) {
    return promoCode;
  }

  params.push(promoCodeId);
  await db.query(
    `UPDATE promo_codes SET ${updates.join(', ')} WHERE id = ?`,
    params
  );

  return getPromoCodeById(promoCodeId);
}

/**
 * Delete a promo code.
 *
 * @param {string|number} promoCodeId
 * @returns {Promise<void>}
 */
async function deletePromoCode(promoCodeId) {
  const promoCode = await findPromoCodeById(promoCodeId);
  if (!promoCode) {
    throw new AppError('Promo code not found.', 404);
  }
  await db.query('DELETE FROM promo_codes WHERE id = ?', [promoCodeId]);
}

/**
 * Record a promo code usage after a successful order.
 *
 * @param {string|number} promoCodeId
 * @param {string|number} userId
 * @param {string|number} orderId
 * @returns {Promise<void>}
 */
async function recordPromoUsage(promoCodeId, userId, orderId) {
  await db.query(
    'INSERT INTO promo_code_usages (promo_code_id, user_id, order_id) VALUES (?, ?, ?)',
    [promoCodeId, userId, orderId]
  );
  await db.query(
    'UPDATE promo_codes SET times_used = times_used + 1 WHERE id = ?',
    [promoCodeId]
  );
}

module.exports = {
  applyPromoCode,
  listPromoCodes,
  createPromoCode,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode,
  recordPromoUsage,
  calculateDiscount,
  checkEligibility,
};
