const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateCreateReturnRequest = [
  body('reason')
    .notEmpty()
    .withMessage('Reason is required.')
    .isString()
    .withMessage('Reason must be a string.')
    .isLength({ max: 1000 })
    .withMessage('Reason must not exceed 1000 characters.'),

  body('items')
    .optional()
    .isArray()
    .withMessage('Items must be an array.'),

  body('items.*.sku_id')
    .optional()
    .isString()
    .withMessage('Item sku_id must be a string.'),

  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Item quantity must be a positive integer.'),

  handleValidationErrors,
];

const validateReviewReturnRequest = [
  body('decision')
    .notEmpty()
    .withMessage('Decision is required.')
    .isIn(['approved', 'rejected'])
    .withMessage('Decision must be either approved or rejected.'),

  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string.')
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters.'),

  handleValidationErrors,
];

module.exports = {
  validateCreateReturnRequest,
  validateReviewReturnRequest,
};
