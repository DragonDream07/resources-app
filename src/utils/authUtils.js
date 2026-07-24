/**
 * Utilities for JWT handling on the client side.
 * NOTE: These utilities operate on the payload encoded in the JWT.
 * They do NOT verify the signature — verification must happen server-side.
 */

/**
 * Decodes a JWT and returns its payload as a plain object.
 * Returns null if the token is invalid or cannot be parsed.
 *
 * @param {string} token - The JWT string.
 * @returns {object|null} The decoded payload object or null.
 */
export function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Checks whether a JWT token has expired based on its `exp` claim.
 *
 * @param {string} token - The JWT string.
 * @returns {boolean} True if the token is expired or invalid, false otherwise.
 */
export function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp < nowSeconds;
}

/**
 * Returns the number of seconds remaining until the token expires.
 * Returns 0 if the token is already expired or invalid.
 *
 * @param {string} token
 * @returns {number}
 */
export function tokenExpiresIn(token) {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return 0;
  const nowSeconds = Math.floor(Date.now() / 1000);
  const remaining = payload.exp - nowSeconds;
  return remaining > 0 ? remaining : 0;
}

/**
 * Extracts specific claims from a JWT payload.
 *
 * @param {string} token
 * @returns {{ sub: string|null, email: string|null, role: string|null, exp: number|null }}
 */
export function getTokenClaims(token) {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return { sub: null, email: null, role: null, exp: null };
  }
  return {
    sub: payload.sub ?? null,
    email: payload.email ?? null,
    role: payload.role ?? null,
    exp: payload.exp ?? null,
  };
}

/**
 * Returns true if the token represents an admin user.
 *
 * @param {string} token
 * @returns {boolean}
 */
export function isAdminToken(token) {
  const { role } = getTokenClaims(token);
  return role === 'admin';
}
