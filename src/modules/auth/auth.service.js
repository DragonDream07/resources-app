const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const RESET_TOKEN_EXPIRES_MINUTES = 60;

function issueToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function register({ email, password, firstName, lastName, phone }) {
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    const err = new Error('An account with this email already exists.');
    err.status = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_guest)
     VALUES ($1, $2, $3, $4, $5, 'customer', false)
     RETURNING id, email, first_name, last_name, phone, role, created_at`,
    [email, passwordHash, firstName, lastName, phone]
  );
  const user = result.rows[0];
  const token = issueToken({ userId: user.id, role: user.role });
  return { token, user };
}

async function login({ email, password }) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1 AND is_guest = false', [email]);
  if (result.rows.length === 0) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }
  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }
  const token = issueToken({ userId: user.id, role: user.role });
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
    },
  };
}

async function logout(token) {
  if (token) {
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp) {
        const expiresAt = new Date(decoded.exp * 1000);
        await pool.query(
          'INSERT INTO token_blacklist (token, expires_at) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [token, expiresAt]
        );
      }
    } catch (_) {
      // Ignore errors when blacklisting
    }
  }
}

async function forgotPassword({ email }) {
  const result = await pool.query('SELECT id FROM users WHERE email = $1 AND is_guest = false', [email]);
  if (result.rows.length === 0) {
    return;
  }
  const user = result.rows[0];
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_MINUTES * 60 * 1000);
  await pool.query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id) DO UPDATE SET token_hash = $2, expires_at = $3`,
    [user.id, resetTokenHash, expiresAt]
  );
  // Email sending is delegated to an external notification service
  // The raw resetToken would be sent via email in a real integration
}

async function resetPassword({ token, password }) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const result = await pool.query(
    `SELECT user_id FROM password_reset_tokens
     WHERE token_hash = $1 AND expires_at > NOW()`,
    [tokenHash]
  );
  if (result.rows.length === 0) {
    const err = new Error('Password reset token is invalid or has expired.');
    err.status = 400;
    throw err;
  }
  const { user_id } = result.rows[0];
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, user_id]);
  await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [user_id]);
}

async function guestRegister({ email, phone }) {
  const passwordHash = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), SALT_ROUNDS);
  let result;
  if (email) {
    const existing = await pool.query('SELECT id, role FROM users WHERE email = $1 AND is_guest = true', [email]);
    if (existing.rows.length > 0) {
      const user = existing.rows[0];
      const token = issueToken({ userId: user.id, role: user.role });
      return { token, user: { id: user.id, email, role: user.role } };
    }
    result = await pool.query(
      `INSERT INTO users (email, password_hash, role, is_guest)
       VALUES ($1, $2, 'guest', true)
       RETURNING id, email, role`,
      [email, passwordHash]
    );
  } else {
    result = await pool.query(
      `INSERT INTO users (phone, password_hash, role, is_guest)
       VALUES ($1, $2, 'guest', true)
       RETURNING id, phone, role`,
      [phone, passwordHash]
    );
  }
  const user = result.rows[0];
  const token = issueToken({ userId: user.id, role: user.role });
  return { token, user };
}

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  guestRegister,
};
