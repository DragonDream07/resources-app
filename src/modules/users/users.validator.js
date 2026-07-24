const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

const validateUpdateMe = [
  body('first_name')
    .optional()
    .isString().withMessage('First name must be a string.')
    .trim()
    .notEmpty().withMessage('First name must not be empty.')
    .isLength({ max: 100 }).withMessage('First name must not exceed 100 characters.'),

  body('last_name')
    .optional()
    .isString().withMessage('Last name must be a string.')
    .trim()
    .notEmpty().withMessage('Last name must not be empty.')
    .isLength({ max: 100 }).withMessage('Last name must not exceed 100 characters.'),

  body('phone')
    .optional()
    .isString().withMessage('Phone must be a string.')
    .trim()
    .matches(/^[+]?[0-9\s\-().]{7,20}$/).withMessage('Phone number is invalid.'),

  handleValidationErrors,
];

const validateChangePassword = [
  body('currentPassword')
    .exists({ checkFalsy: true }).withMessage('Current password is required.')
    .isString().withMessage('Current password must be a string.'),

  body('newPassword')
    .exists({ checkFalsy: true }).withMessage('New password is required.')
    .isString().withMessage('New password must be a string.')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter.')
    .matches(/[a-z]/).withMessage('New password must contain at least one lowercase letter.')
    .matches(/[0-9]/).withMessage('New password must contain at least one number.'),

  body('confirmNewPassword')
    .exists({ checkFalsy: true }).withMessage('Confirm new password is required.')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),

  handleValidationErrors,
];

const validateUpdateUser = [
  body('first_name')
    .optional()
    .isString().withMessage('First name must be a string.')
    .trim()
    .notEmpty().withMessage('First name must not be empty.')
    .isLength({ max: 100 }).withMessage('First name must not exceed 100 characters.'),

  body('last_name')
    .optional()
    .isString().withMessage('Last name must be a string.')
    .trim()
    .notEmpty().withMessage('Last name must not be empty.')
    .isLength({ max: 100 }).withMessage('Last name must not exceed 100 characters.'),

  body('phone')
    .optional()
    .isString().withMessage('Phone must be a string.')
    .trim()
    .matches(/^[+]?[0-9\s\-().]{7,20}$/).withMessage('Phone number is invalid.'),

  body('role')
    .optional()
    .isIn(['customer', 'admin', 'staff']).withMessage('Role must be one of: customer, admin, staff.'),

  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean.'),

  handleValidationErrors,
];

const validateAddress = [
  body('first_name')
    .exists({ checkFalsy: true }).withMessage('First name is required.')
    .isString().withMessage('First name must be a string.')
    .trim()
    .isLength({ max: 100 }).withMessage('First name must not exceed 100 characters.'),

  body('last_name')
    .exists({ checkFalsy: true }).withMessage('Last name is required.')
    .isString().withMessage('Last name must be a string.')
    .trim()
    .isLength({ max: 100 }).withMessage('Last name must not exceed 100 characters.'),

  body('phone')
    .exists({ checkFalsy: true }).withMessage('Phone is required.')
    .isString().withMessage('Phone must be a string.')
    .trim()
    .matches(/^[+]?[0-9\s\-().]{7,20}$/).withMessage('Phone number is invalid.'),

  body('address_line1')
    .exists({ checkFalsy: true }).withMessage('Address line 1 is required.')
    .isString().withMessage('Address line 1 must be a string.')
    .trim()
    .isLength({ max: 255 }).withMessage('Address line 1 must not exceed 255 characters.'),

  body('address_line2')
    .optional()
    .isString().withMessage('Address line 2 must be a string.')
    .trim()
    .isLength({ max: 255 }).withMessage('Address line 2 must not exceed 255 characters.'),

  body('city')
    .exists({ checkFalsy: true }).withMessage('City is required.')
    .isString().withMessage('City must be a string.')
    .trim()
    .isLength({ max: 100 }).withMessage('City must not exceed 100 characters.'),

  body('state')
    .exists({ checkFalsy: true }).withMessage('State is required.')
    .isString().withMessage('State must be a string.')
    .trim()
    .isLength({ max: 100 }).withMessage('State must not exceed 100 characters.'),

  body('postal_code')
    .exists({ checkFalsy: true }).withMessage('Postal code is required.')
    .isString().withMessage('Postal code must be a string.')
    .trim()
    .isLength({ max: 20 }).withMessage('Postal code must not exceed 20 characters.'),

  body('country')
    .exists({ checkFalsy: true }).withMessage('Country is required.')
    .isString().withMessage('Country must be a string.')
    .trim()
    .isLength({ min: 2, max: 2 }).withMessage('Country must be a valid 2-letter ISO country code.'),

  body('label')
    .optional()
    .isString().withMessage('Label must be a string.')
    .trim()
    .isLength({ max: 50 }).withMessage('Label must not exceed 50 characters.'),

  body('is_default')
    .optional()
    .isBoolean().withMessage('is_default must be a boolean.'),

  handleValidationErrors,
];

module.exports = {
  validateUpdateMe,
  validateChangePassword,
  validateUpdateUser,
  validateAddress,
};
