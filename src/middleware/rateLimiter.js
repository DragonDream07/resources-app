'use strict';

const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for authentication routes (login, register, guest-register).
 * Allows up to 20 requests per 15-minute window per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many authentication attempts. Please try again later.',
  },
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for password-reset routes (forgot-password, reset-password).
 * Allows up to 5 requests per 60-minute window per IP to limit abuse.
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many password reset attempts. Please try again after an hour.',
  },
  skipSuccessfulRequests: false,
});

module.exports = { authLimiter, passwordResetLimiter };
