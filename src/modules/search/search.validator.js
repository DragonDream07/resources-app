const { query, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors and return a 400 response.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

/**
 * Validation rules for GET /search
 */
const validateSearch = [
  query('q')
    .optional()
    .isString()
    .withMessage('q must be a string')
    .isLength({ max: 200 })
    .withMessage('q must not exceed 200 characters'),

  query('filters')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          JSON.parse(value);
        } catch (e) {
          throw new Error('filters must be a valid JSON string');
        }
      }
      return true;
    }),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer')
    .toInt(),

  query('size')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('size must be an integer between 1 and 100')
    .toInt(),

  query('sort')
    .optional()
    .isString()
    .withMessage('sort must be a string')
    .isIn(['_score', 'price_asc', 'price_desc', 'newest', 'popularity'])
    .withMessage('sort must be one of: _score, price_asc, price_desc, newest, popularity'),

  handleValidationErrors,
];

/**
 * Validation rules for GET /search/suggest
 */
const validateSuggest = [
  query('q')
    .notEmpty()
    .withMessage('q is required')
    .isString()
    .withMessage('q must be a string')
    .isLength({ min: 1, max: 100 })
    .withMessage('q must be between 1 and 100 characters'),

  query('size')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('size must be an integer between 1 and 20')
    .toInt(),

  handleValidationErrors,
];

module.exports = { validateSearch, validateSuggest };
