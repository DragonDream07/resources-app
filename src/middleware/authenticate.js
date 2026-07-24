'use strict';

const jwt = require('jsonwebtoken');

/**
 * JWT verification middleware.
 * Verifies the Bearer token from the Authorization header and attaches the
 * decoded payload to req.user. Responds with 401 if the token is missing or
 * invalid.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      code: 'UNAUTHORIZED',
      message: 'Authentication token is missing or malformed.',
    });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        code: 'TOKEN_EXPIRED',
        message: 'Authentication token has expired.',
      });
    }

    return res.status(401).json({
      status: 'error',
      code: 'INVALID_TOKEN',
      message: 'Authentication token is invalid.',
    });
  }
}

module.exports = authenticate;
