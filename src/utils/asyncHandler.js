/**
 * Wraps an async Express route handler and forwards any thrown errors
 * to the next() error handler, satisfying the project error-handling contract.
 *
 * @param {Function} fn - Async route handler (req, res, next)
 * @returns {Function} Express-compatible middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
