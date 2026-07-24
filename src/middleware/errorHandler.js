'use strict';

/**
 * Centralised Express error handler.
 * Must be registered LAST in the middleware chain (after all routes).
 *
 * Produces structured JSON error responses of the form:
 *   { status: 'error', code: string, message: string, [details]: any }
 *
 * HTTP status codes:
 *   - err.statusCode / err.status  → used when set by throwing code
 *   - Joi ValidationError          → 422
 *   - Everything else              → 500
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Joi validation errors surfaced manually or via the validate middleware
  if (err.isJoi || err.name === 'ValidationError') {
    const details = err.details
      ? err.details.map((d) => ({ field: d.path.join('.'), message: d.message }))
      : undefined;

    return res.status(422).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed.',
      details,
    });
  }

  // JWT errors that bubble up without being caught in authenticate middleware
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      code: 'INVALID_TOKEN',
      message: err.message,
    });
  }

  const statusCode =
    (typeof err.statusCode === 'number' && err.statusCode) ||
    (typeof err.status === 'number' && err.status) ||
    500;

  const code = err.code || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR');
  const message =
    statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : err.message || 'An unexpected error occurred.';

  const payload = {
    status: 'error',
    code,
    message,
  };

  if (err.details !== undefined) {
    payload.details = err.details;
  }

  // Log 5xx errors to stderr
  if (statusCode >= 500) {
    console.error('[errorHandler]', err);
  }

  return res.status(statusCode).json(payload);
}

module.exports = errorHandler;
