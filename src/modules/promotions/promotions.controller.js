const promotionsService = require('./promotions.service');

/**
 * POST /carts/:cartId/promo
 * Apply / validate a promo code against a cart.
 */
async function applyPromoCode(req, res, next) {
  try {
    const { cartId } = req.params;
    const { code } = req.body;
    const userId = req.user.id;
    const result = await promotionsService.applyPromoCode({ cartId, code, userId });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/promo-codes  (also GET /promo-codes)
 * List all promo codes with optional filters.
 */
async function listPromoCodes(req, res, next) {
  try {
    const filters = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
      status: req.query.status,
      search: req.query.search,
    };
    const result = await promotionsService.listPromoCodes(filters);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /admin/promo-codes
 * Create a new promo code.
 */
async function createPromoCode(req, res, next) {
  try {
    const promoCode = await promotionsService.createPromoCode(req.body);
    return res.status(201).json(promoCode);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/promo-codes/:promoCodeId
 * Retrieve a single promo code.
 */
async function getPromoCode(req, res, next) {
  try {
    const { promoCodeId } = req.params;
    const promoCode = await promotionsService.getPromoCodeById(promoCodeId);
    return res.status(200).json(promoCode);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /admin/promo-codes/:promoCodeId
 * Update an existing promo code.
 */
async function updatePromoCode(req, res, next) {
  try {
    const { promoCodeId } = req.params;
    const promoCode = await promotionsService.updatePromoCode(promoCodeId, req.body);
    return res.status(200).json(promoCode);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /admin/promo-codes/:promoCodeId
 * Delete a promo code.
 */
async function deletePromoCode(req, res, next) {
  try {
    const { promoCodeId } = req.params;
    await promotionsService.deletePromoCode(promoCodeId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  applyPromoCode,
  listPromoCodes,
  createPromoCode,
  getPromoCode,
  updatePromoCode,
  deletePromoCode,
};
