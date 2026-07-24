const db = require('../../db');
const { AppError } = require('../../utils/errors');
const { v4: uuidv4 } = require('uuid');

// In-memory checkout session store (keyed by sessionId).
// In production this should be backed by Redis or a sessions table.
const checkoutSessions = new Map();

/**
 * startCheckout
 * Validates the cart exists and belongs to the user/guest,
 * then creates a checkout session.
 */
async function startCheckout({ cartId, userId, guestEmail }) {
  if (!cartId) {
    throw new AppError('cartId is required to start checkout.', 400);
  }

  // Fetch cart from DB
  const cartResult = await db.query(
    `SELECT c.id, c.user_id, c.guest_email, c.status,
            json_agg(
              json_build_object(
                'itemId', ci.id,
                'skuId', ci.sku_id,
                'quantity', ci.quantity,
                'unitPrice', ci.unit_price,
                'productName', p.name,
                'skuCode', s.sku_code,
                'stockQty', s.stock_qty
              )
            ) AS items
     FROM carts c
     LEFT JOIN cart_items ci ON ci.cart_id = c.id
     LEFT JOIN skus s ON s.id = ci.sku_id
     LEFT JOIN products p ON p.id = s.product_id
     WHERE c.id = $1
     GROUP BY c.id`,
    [cartId]
  );

  if (!cartResult.rows.length) {
    throw new AppError('Cart not found.', 404);
  }

  const cart = cartResult.rows[0];

  if (cart.status !== 'active') {
    throw new AppError('Cart is no longer active.', 400);
  }

  // Ownership check
  if (userId && cart.user_id && cart.user_id !== userId) {
    throw new AppError('Cart does not belong to the current user.', 403);
  }

  if (!userId && guestEmail && cart.guest_email && cart.guest_email !== guestEmail) {
    throw new AppError('Cart does not belong to this guest.', 403);
  }

  const items = (cart.items || []).filter(Boolean);
  if (!items.length) {
    throw new AppError('Cannot start checkout with an empty cart.', 400);
  }

  // Verify stock availability
  for (const item of items) {
    if (item.stockQty < item.quantity) {
      throw new AppError(
        `Insufficient stock for SKU ${item.skuCode}. Available: ${item.stockQty}, Requested: ${item.quantity}.`,
        409
      );
    }
  }

  const sessionId = uuidv4();
  const session = {
    sessionId,
    cartId,
    userId: userId || null,
    guestEmail: guestEmail || cart.guest_email || null,
    items,
    address: null,
    promoCode: null,
    promoDiscount: 0,
    subtotal: items.reduce((sum, i) => sum + parseFloat(i.unitPrice) * i.quantity, 0),
    status: 'started',
    createdAt: new Date().toISOString(),
  };

  checkoutSessions.set(sessionId, session);

  return {
    checkoutSessionId: sessionId,
    cartId,
    itemCount: items.length,
    subtotal: session.subtotal,
    status: session.status,
  };
}

/**
 * saveAddress
 * Validates and attaches a shipping address to the checkout session.
 */
async function saveAddress({ checkoutSessionId, userId, address }) {
  const session = _getSession(checkoutSessionId);
  _assertSessionOwner(session, userId);

  // Validate address fields
  _validateAddress(address);

  // Optionally: verify serviceability via pincode lookup
  const serviceable = await _checkServiceability(address.pincode);
  if (!serviceable) {
    throw new AppError(
      `Delivery is not available to pincode ${address.pincode}. Please use a different address.`,
      422
    );
  }

  session.address = {
    fullName: address.fullName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2 || null,
    city: address.city,
    state: address.state,
    country: address.country,
    pincode: address.pincode,
  };

  session.status = 'address_saved';
  checkoutSessions.set(checkoutSessionId, session);

  return {
    checkoutSessionId,
    address: session.address,
    status: session.status,
  };
}

/**
 * reviewCheckout
 * Assembles and returns the full checkout summary.
 */
async function reviewCheckout({ checkoutSessionId, userId }) {
  const session = _getSession(checkoutSessionId);
  _assertSessionOwner(session, userId);

  const shippingCost = _calculateShipping(session);
  const tax = _calculateTax(session.subtotal - session.promoDiscount);
  const total = session.subtotal - session.promoDiscount + shippingCost + tax;

  return {
    checkoutSessionId,
    cartId: session.cartId,
    items: session.items,
    address: session.address,
    promoCode: session.promoCode,
    subtotal: _round(session.subtotal),
    promoDiscount: _round(session.promoDiscount),
    shippingCost: _round(shippingCost),
    tax: _round(tax),
    total: _round(total),
    status: session.status,
  };
}

/**
 * placeOrder
 * Confirms stock, finalises promo, inserts the order record,
 * and delegates payment intent creation.
 */
async function placeOrder({ checkoutSessionId, userId, paymentMethod, paymentDetails }) {
  const session = _getSession(checkoutSessionId);
  _assertSessionOwner(session, userId);

  if (!session.address) {
    throw new AppError('Shipping address is required before placing an order.', 400);
  }

  if (!paymentMethod) {
    throw new AppError('paymentMethod is required.', 400);
  }

  // Re-confirm stock
  await _confirmStock(session.items);

  // Finalise promo
  const promoDiscount = await _finalisePromo(session);

  const shippingCost = _calculateShipping(session);
  const tax = _calculateTax(session.subtotal - promoDiscount);
  const total = _round(session.subtotal - promoDiscount + shippingCost + tax);

  const orderId = uuidv4();
  const orderNumber = _generateOrderNumber();
  const now = new Date().toISOString();

  // Insert order into DB
  await db.query(
    `INSERT INTO orders (
        id, order_number, user_id, guest_email, status,
        shipping_address, items, subtotal, promo_code, promo_discount,
        shipping_cost, tax, total, payment_method, payment_status, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17
      )`,
    [
      orderId,
      orderNumber,
      session.userId || null,
      session.guestEmail || null,
      'pending_payment',
      JSON.stringify(session.address),
      JSON.stringify(session.items),
      session.subtotal,
      session.promoCode || null,
      promoDiscount,
      shippingCost,
      tax,
      total,
      paymentMethod,
      'pending',
      now,
      now,
    ]
  );

  // Reserve stock
  await _reserveStock(session.items);

  // Delegate payment intent
  const paymentIntent = await _delegatePaymentIntent({
    orderId,
    amount: total,
    currency: 'INR',
    paymentMethod,
    paymentDetails,
  });

  // Mark session as completed
  session.status = 'order_placed';
  checkoutSessions.set(checkoutSessionId, session);

  return {
    orderId,
    orderNumber,
    total,
    paymentMethod,
    paymentStatus: 'pending',
    paymentIntent,
    status: 'pending_payment',
  };
}

// ─── Private helpers ──────────────────────────────────────────────────────────

function _getSession(checkoutSessionId) {
  if (!checkoutSessionId) {
    throw new AppError('checkoutSessionId is required.', 400);
  }
  const session = checkoutSessions.get(checkoutSessionId);
  if (!session) {
    throw new AppError('Checkout session not found or has expired.', 404);
  }
  return session;
}

function _assertSessionOwner(session, userId) {
  if (userId && session.userId && session.userId !== userId) {
    throw new AppError('Access to this checkout session is forbidden.', 403);
  }
}

function _validateAddress(address) {
  const required = ['fullName', 'phone', 'line1', 'city', 'state', 'country', 'pincode'];
  for (const field of required) {
    if (!address || !address[field] || String(address[field]).trim() === '') {
      throw new AppError(`Address field '${field}' is required.`, 400);
    }
  }
  if (!/^\d{6}$/.test(String(address.pincode))) {
    throw new AppError('Pincode must be a 6-digit number.', 400);
  }
  if (!/^[6-9]\d{9}$/.test(String(address.phone))) {
    throw new AppError('Phone number must be a valid 10-digit Indian mobile number.', 400);
  }
}

async function _checkServiceability(pincode) {
  // Stub: in production, query a serviceability table or external API.
  // Returning true by default unless explicitly blacklisted.
  try {
    const result = await db.query(
      `SELECT serviceable FROM serviceability WHERE pincode = $1`,
      [String(pincode)]
    );
    if (result.rows.length > 0) {
      return result.rows[0].serviceable;
    }
    return true; // default: serviceable
  } catch {
    return true;
  }
}

async function _confirmStock(items) {
  for (const item of items) {
    const result = await db.query(
      `SELECT stock_qty, sku_code FROM skus WHERE id = $1`,
      [item.skuId]
    );
    if (!result.rows.length) {
      throw new AppError(`SKU ${item.skuId} not found.`, 404);
    }
    const sku = result.rows[0];
    if (sku.stock_qty < item.quantity) {
      throw new AppError(
        `Insufficient stock for SKU ${sku.sku_code}. Available: ${sku.stock_qty}, Requested: ${item.quantity}.`,
        409
      );
    }
  }
}

async function _reserveStock(items) {
  for (const item of items) {
    await db.query(
      `UPDATE skus SET stock_qty = stock_qty - $1 WHERE id = $2`,
      [item.quantity, item.skuId]
    );
  }
}

async function _finalisePromo(session) {
  if (!session.promoCode) {
    return 0;
  }
  // Validate promo is still active and usage limit not exceeded
  const result = await db.query(
    `SELECT id, discount_type, discount_value, max_uses, used_count, valid_until
     FROM promo_codes
     WHERE code = $1 AND is_active = true`,
    [session.promoCode]
  );
  if (!result.rows.length) {
    throw new AppError(`Promo code '${session.promoCode}' is no longer valid.`, 422);
  }
  const promo = result.rows[0];
  if (promo.valid_until && new Date(promo.valid_until) < new Date()) {
    throw new AppError(`Promo code '${session.promoCode}' has expired.`, 422);
  }
  if (promo.max_uses !== null && promo.used_count >= promo.max_uses) {
    throw new AppError(`Promo code '${session.promoCode}' has reached its usage limit.`, 422);
  }

  let discount = 0;
  if (promo.discount_type === 'flat') {
    discount = parseFloat(promo.discount_value);
  } else if (promo.discount_type === 'percentage') {
    discount = _round((parseFloat(promo.discount_value) / 100) * session.subtotal);
  }

  // Increment usage count
  await db.query(
    `UPDATE promo_codes SET used_count = used_count + 1 WHERE id = $1`,
    [promo.id]
  );

  return discount;
}

async function _delegatePaymentIntent({ orderId, amount, currency, paymentMethod, paymentDetails }) {
  // Stub: in production, call the payments service/module.
  // Returns a mock payment intent object.
  return {
    paymentIntentId: `pi_${orderId.replace(/-/g, '').slice(0, 24)}`,
    orderId,
    amount,
    currency,
    paymentMethod,
    status: 'created',
  };
}

function _calculateShipping(session) {
  // Flat-rate shipping stub: ₹50 for orders below ₹500, free above.
  if (session.subtotal - session.promoDiscount >= 500) {
    return 0;
  }
  return 50;
}

function _calculateTax(taxableAmount) {
  // 18% GST stub.
  return _round(taxableAmount * 0.18);
}

function _round(value) {
  return Math.round(value * 100) / 100;
}

function _generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${ts}-${rand}`;
}

module.exports = {
  startCheckout,
  saveAddress,
  reviewCheckout,
  placeOrder,
};
