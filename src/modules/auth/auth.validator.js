const { body, validationResult } = require('express-validator');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('A valid email address is required.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number.'),
  body('firstName')
    .notEmpty()
    .withMessage('First name is required.'),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required.'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('A valid phone number is required.'),
  handleValidation,
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('A valid email address is required.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
  handleValidation,
];

const validateGuestRegister = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('A valid email address is required.')
    .normalizeEmail(),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('A valid phone number is required.'),
  body()
    .custom((_, { req }) => {
      if (!req.body.email && !req.body.phone) {
        throw new Error('Either email or phone is required.');
      }
      return true;
    }),
  handleValidation,
];

const validateForgotPassword = [
  body('email')
    .isEmail()
    .withMessage('A valid email address is required.')
    .normalizeEmail(),
  handleValidation,
];

const validateResetPassword = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number.'),
  handleValidation,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateGuestRegister,
  validateForgotPassword,
  validateResetPassword,
};
