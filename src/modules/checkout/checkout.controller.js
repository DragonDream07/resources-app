const checkoutService = require('./checkout.service');
const { AppError } = require('../../utils/errors');

/**
 * POST /checkout/start
 * Initiates a checkout session for the given cart.
 */
async function startCheckout(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const { cartId, guestEmail } = req.body;
    const session = await checkoutService.startCheckout({ cartId, userId, guestEmail });
    return res.status(200).json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /checkout/address
 * Saves the shipping address for the current checkout session.
 */
async function saveAddress(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const { checkoutSessionId, address } = req.body;
    const result = await checkoutService.saveAddress({ checkoutSessionId, userId, address });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /checkout/review
 * Returns the full checkout summary (items, address, pricing, promo).
 */
async function reviewCheckout(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const { checkoutSessionId } = req.query;
    const review = await checkoutService.reviewCheckout({ checkoutSessionId, userId });
    return res.status(200).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /checkout/place-order
 * Confirms stock, finalises promo, creates the order and delegates payment intent.
 */
async function placeOrder(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const { checkoutSessionId, paymentMethod, paymentDetails } = req.body;
    const order = await checkoutService.placeOrder({ checkoutSessionId, userId, paymentMethod, paymentDetails });
    return res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  startCheckout,
  saveAddress,
  reviewCheckout,
  placeOrder,
};
