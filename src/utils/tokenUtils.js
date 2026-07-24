const crypto = require('crypto');

const TOKEN_BYTE_LENGTH = 32;

/**
 * Generate a cryptographically secure reset token.
 *
 * Returns both the raw token (to send to the user) and its SHA-256 hash
 * (to persist in the database so the raw token is never stored).
 *
 * @returns {{ rawToken: string, hashedToken: string }}
 */
const generateResetToken = () => {
  const rawToken = crypto.randomBytes(TOKEN_BYTE_LENGTH).toString('hex');
  const hashedToken = hashToken(rawToken);
  return { rawToken, hashedToken };
};

/**
 * Hash a raw token with SHA-256.
 *
 * @param {string} rawToken - Hex-encoded raw token
 * @returns {string} Hex-encoded SHA-256 hash
 */
const hashToken = (rawToken) => {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};

/**
 * Verify that a raw token matches a stored hashed token.
 *
 * @param {string} rawToken    - Raw token received from the user
 * @param {string} hashedToken - SHA-256 hash stored in the database
 * @returns {boolean}
 */
const verifyToken = (rawToken, hashedToken) => {
  const candidateHash = hashToken(rawToken);
  return crypto.timingSafeEqual(
    Buffer.from(candidateHash, 'hex'),
    Buffer.from(hashedToken, 'hex')
  );
};

module.exports = { generateResetToken, hashToken, verifyToken };
