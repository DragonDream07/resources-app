const { body, validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

const VALID_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'return_requested',
  'returned',
];

const validateAdvanceOrder = [
  body('status')
    .notEmpty()
    .withMessage('status is required')
    .isIn(VALID_STATUSES)
    .withMessage(`status must be one of: ${VALID_STATUSES.join(', ')}`),
  body('trackingNumber')
    .optional()
    .isString()
    .withMessage('trackingNumber must be a string')
    .trim(),
  body('carrier')
    .optional()
    .isString()
    .withMessage('carrier must be a string')
    .trim(),
  body('trackingUrl')
    .optional()
    .isURL()
    .withMessage('trackingUrl must be a valid URL'),
  handleValidationErrors,
];

const validateCancelOrder = [
  body('reason')
    .optional()
    .isString()
    .withMessage('reason must be a string')
    .isLength({ max: 500 })
    .withMessage('reason must not exceed 500 characters')
    .trim(),
  handleValidationErrors,
];

const validateReturnRequest = [
  body('reason')
    .notEmpty()
    .withMessage('reason is required')
    .isString()
    .withMessage('reason must be a string')
    .isLength({ max: 1000 })
    .withMessage('reason must not exceed 1000 characters')
    .trim(),
  body('notes')
    .optional()
    .isString()
    .withMessage('notes must be a string')
    .isLength({ max: 2000 })
    .withMessage('notes must not exceed 2000 characters')
    .trim(),
  body('items')
    .optional()
    .isArray()
    .withMessage('items must be an array'),
  body('items.*.orderItemId')
    .if(body('items').exists())
    .notEmpty()
    .withMessage('items[].orderItemId is required')
    .isUUID()
    .withMessage('items[].orderItemId must be a valid UUID'),
  body('items.*.quantity')
    .if(body('items').exists())
    .notEmpty()
    .withMessage('items[].quantity is required')
    .isInt({ min: 1 })
    .withMessage('items[].quantity must be a positive integer'),
  handleValidationErrors,
];

module.exports = {
  validateAdvanceOrder,
  validateCancelOrder,
  validateReturnRequest,
};
