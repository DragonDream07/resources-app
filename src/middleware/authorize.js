'use strict';

/**
 * RBAC middleware factory.
 * Returns an Express middleware that checks whether req.user possesses at
 * least one of the required roles. Roles are expected to be stored on
 * req.user.roles as an array of role-name strings.
 *
 * Usage:
 *   router.get('/admin', authenticate, authorize('admin'), handler)
 *   router.get('/staff', authenticate, authorize('admin', 'staff'), handler)
 *
 * @param {...string} roles - One or more role names that are permitted.
 * @returns {Function} Express middleware
 */
function authorize(...roles) {
  return function authorizeMiddleware(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'You must be authenticated to access this resource.',
      });
    }

    const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [];

    const hasRole = roles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'You do not have permission to access this resource.',
      });
    }

    return next();
  };
}

module.exports = authorize;
