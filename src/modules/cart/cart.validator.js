const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.param, message: e.msg })),
    });
  }
  next();
};

const validateCreateCart = [
  body('guestId')
    .optional()
    .isString()
    .withMessage('guestId must be a string'),
  handleValidationErrors,
];

const validateAddItem = [
  body('skuId')
    .notEmpty()
    .withMessage('skuId is required')
    .isInt({ min: 1 })
    .withMessage('skuId must be a positive integer'),
  body('quantity')
    .notEmpty()
    .withMessage('quantity is required')
    .isInt({ min: 1 })
    .withMessage('quantity must be a positive integer'),
  handleValidationErrors,
];

const validateUpdateItem = [
  body('quantity')
    .notEmpty()
    .withMessage('quantity is required')
    .isInt({ min: 0 })
    .withMessage('quantity must be a non-negative integer'),
  handleValidationErrors,
];

const validateApplyPromo = [
  body('promoCode')
    .notEmpty()
    .withMessage('promoCode is required')
    .isString()
    .withMessage('promoCode must be a string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('promoCode must be between 1 and 100 characters'),
  handleValidationErrors,
];

module.exports = {
  validateCreateCart,
  validateAddItem,
  validateUpdateItem,
  validateApplyPromo,
};
