const { body, param } = require('express-validator');
const { validationResult } = require('express-validator');

/**
 * Middleware to run express-validator checks and return 422 on failure.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.param, message: e.msg })),
    });
  }
  next();
}

/**
 * Validation rules for POST /payments/initiate
 */
const validateInitiatePayment = [
  body('orderId')
    .notEmpty()
    .withMessage('orderId is required.')
    .isUUID()
    .withMessage('orderId must be a valid UUID.'),

  body('provider')
    .notEmpty()
    .withMessage('provider is required.')
    .isString()
    .withMessage('provider must be a string.'),

  body('amount')
    .notEmpty()
    .withMessage('amount is required.')
    .isFloat({ gt: 0 })
    .withMessage('amount must be a positive number.'),

  body('currency')
    .optional()
    .isString()
    .withMessage('currency must be a string.')
    .isLength({ min: 3, max: 3 })
    .withMessage('currency must be a 3-letter ISO code.'),

  body('method')
    .optional()
    .isString()
    .withMessage('method must be a string.'),

  body('returnUrl')
    .optional()
    .isURL()
    .withMessage('returnUrl must be a valid URL.'),

  body('metadata')
    .optional()
    .isObject()
    .withMessage('metadata must be an object.'),

  handleValidationErrors,
];

/**
 * Validation rules for POST /payments/callback (webhook)
 */
const validateCallback = [
  body('provider')
    .optional()
    .isString()
    .withMessage('provider must be a string.'),

  body('paymentId')
    .optional()
    .isUUID()
    .withMessage('paymentId must be a valid UUID.'),

  body('providerRef')
    .optional()
    .isString()
    .withMessage('providerRef must be a string.'),

  body('status')
    .optional()
    .isString()
    .withMessage('status must be a string.'),

  handleValidationErrors,
];

/**
 * Validation rules for POST /payments/:paymentId/retry
 */
const validateRetry = [
  param('paymentId')
    .notEmpty()
    .withMessage('paymentId is required.')
    .isUUID()
    .withMessage('paymentId must be a valid UUID.'),

  body('provider')
    .optional()
    .isString()
    .withMessage('provider must be a string.'),

  body('metadata')
    .optional()
    .isObject()
    .withMessage('metadata must be an object.'),

  handleValidationErrors,
];

module.exports = {
  validateInitiatePayment,
  validateCallback,
  validateRetry,
};
