'use strict';

/**
 * Generic validation middleware factory for Joi schemas.
 *
 * Usage:
 *   router.post('/endpoint', validate(mySchema), handler)
 *
 * By default the middleware validates req.body. Pass a second argument to
 * validate a different part of the request:
 *   validate(schema, 'query')  → validates req.query
 *   validate(schema, 'params') → validates req.params
 *
 * On validation failure the middleware forwards a structured error to the
 * next error handler (errorHandler.js) with isJoi=true so it is rendered as
 * a 422 VALIDATION_ERROR response.
 *
 * @param {import('joi').Schema} schema - Joi schema to validate against.
 * @param {'body'|'query'|'params'} [source='body'] - Request property to validate.
 * @returns {Function} Express middleware
 */
function validate(schema, source = 'body') {
  return function validationMiddleware(req, res, next) {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      error.isJoi = true;
      return next(error);
    }

    // Replace the validated source with the sanitised/coerced Joi output
    req[source] = value;
    return next();
  };
}

module.exports = validate;
