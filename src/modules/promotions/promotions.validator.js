const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../../middleware/validation.middleware');

const VALID_DISCOUNT_TYPES = ['percentage', 'flat', 'free_shipping'];
const VALID_STATUSES = ['active', 'inactive', 'expired'];

/**
 * Validation schema for applying / validating a promo code on a cart.
 * POST /carts/:cartId/promo
 */
const validatePromoCode = [
  param('cartId')
    .notEmpty()
    .withMessage('Cart ID is required.')
    .isInt({ min: 1 })
    .withMessage('Cart ID must be a positive integer.'),

  body('code')
    .notEmpty()
    .withMessage('Promo code is required.')
    .isString()
    .withMessage('Promo code must be a string.')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Promo code must be between 1 and 50 characters.'),

  handleValidationErrors,
];

/**
 * Validation schema for creating a promo code.
 * POST /admin/promo-codes
 */
const validateCreatePromoCode = [
  body('code')
    .notEmpty()
    .withMessage('Promo code is required.')
    .isString()
    .withMessage('Promo code must be a string.')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Promo code must be between 1 and 50 characters.')
    .matches(/^[A-Za-z0-9_\-]+$/)
    .withMessage('Promo code may only contain letters, numbers, hyphens, and underscores.'),

  body('discount_type')
    .notEmpty()
    .withMessage('Discount type is required.')
    .isIn(VALID_DISCOUNT_TYPES)
    .withMessage(`Discount type must be one of: ${VALID_DISCOUNT_TYPES.join(', ')}.`),

  body('discount_value')
    .notEmpty()
    .withMessage('Discount value is required.')
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a non-negative number.'),

  body('max_discount_value')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Max discount value must be a non-negative number.'),

  body('min_order_value')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Minimum order value must be a non-negative number.'),

  body('usage_limit')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Usage limit must be a positive integer.'),

  body('per_user_limit')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Per-user limit must be a positive integer.'),

  body('valid_from')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('valid_from must be a valid ISO 8601 date.'),

  body('valid_until')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('valid_until must be a valid ISO 8601 date.')
    .custom((value, { req }) => {
      if (value && req.body.valid_from && new Date(value) <= new Date(req.body.valid_from)) {
        throw new Error('valid_until must be after valid_from.');
      }
      return true;
    }),

  body('status')
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}.`),

  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be a string.')
    .isLength({ max: 255 })
    .withMessage('Description must not exceed 255 characters.'),

  handleValidationErrors,
];

/**
 * Validation schema for updating a promo code.
 * PUT /admin/promo-codes/:promoCodeId
 */
const validateUpdatePromoCode = [
  param('promoCodeId')
    .notEmpty()
    .withMessage('Promo code ID is required.')
    .isInt({ min: 1 })
    .withMessage('Promo code ID must be a positive integer.'),

  body('code')
    .optional()
    .isString()
    .withMessage('Promo code must be a string.')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Promo code must be between 1 and 50 characters.')
    .matches(/^[A-Za-z0-9_\-]+$/)
    .withMessage('Promo code may only contain letters, numbers, hyphens, and underscores.'),

  body('discount_type')
    .optional()
    .isIn(VALID_DISCOUNT_TYPES)
    .withMessage(`Discount type must be one of: ${VALID_DISCOUNT_TYPES.join(', ')}.`),

  body('discount_value')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a non-negative number.'),

  body('max_discount_value')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Max discount value must be a non-negative number.'),

  body('min_order_value')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Minimum order value must be a non-negative number.'),

  body('usage_limit')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Usage limit must be a positive integer.'),

  body('per_user_limit')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Per-user limit must be a positive integer.'),

  body('valid_from')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('valid_from must be a valid ISO 8601 date.'),

  body('valid_until')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('valid_until must be a valid ISO 8601 date.')
    .custom((value, { req }) => {
      if (value && req.body.valid_from && new Date(value) <= new Date(req.body.valid_from)) {
        throw new Error('valid_until must be after valid_from.');
      }
      return true;
    }),

  body('status')
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}.`),

  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be a string.')
    .isLength({ max: 255 })
    .withMessage('Description must not exceed 255 characters.'),

  handleValidationErrors,
];

module.exports = {
  validatePromoCode,
  validateCreatePromoCode,
  validateUpdatePromoCode,
};
