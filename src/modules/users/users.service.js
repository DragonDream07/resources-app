const db = require('../../db');
const bcrypt = require('bcryptjs');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../../errors');

const SALT_ROUNDS = 12;

const safeUserFields = [
  'id',
  'email',
  'first_name',
  'last_name',
  'phone',
  'role',
  'is_active',
  'created_at',
  'updated_at',
];

const getUserById = async (userId) => {
  const result = await db.query(
    `SELECT ${safeUserFields.join(', ')} FROM users WHERE id = $1 AND deleted_at IS NULL`,
    [userId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('User not found.');
  }
  return result.rows[0];
};

const getUsers = async ({ page = 1, limit = 20, search, role } = {}) => {
  const offset = (page - 1) * limit;
  const conditions = ['deleted_at IS NULL'];
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(first_name ILIKE $${params.length} OR last_name ILIKE $${params.length} OR email ILIKE $${params.length})`);
  }

  if (role) {
    params.push(role);
    conditions.push(`role = $${params.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await db.query(
    `SELECT COUNT(*) FROM users ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count, 10);

  params.push(limit);
  params.push(offset);

  const result = await db.query(
    `SELECT ${safeUserFields.join(', ')} FROM users ${whereClause} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return {
    data: result.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateUser = async (userId, payload) => {
  const allowedFields = ['first_name', 'last_name', 'phone', 'role', 'is_active'];
  const fields = [];
  const params = [];

  for (const field of allowedFields) {
    if (payload[field] !== undefined) {
      params.push(payload[field]);
      fields.push(`${field} = $${params.length}`);
    }
  }

  if (!fields.length) {
    return getUserById(userId);
  }

  params.push('NOW()');
  fields.push(`updated_at = $${params.length}`);

  params.push(userId);

  const result = await db.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${params.length} AND deleted_at IS NULL RETURNING ${safeUserFields.join(', ')}`,
    params
  );

  if (!result.rows.length) {
    throw new NotFoundError('User not found.');
  }

  return result.rows[0];
};

const deleteUser = async (userId) => {
  const result = await db.query(
    `UPDATE users SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
    [userId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('User not found.');
  }
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const result = await db.query(
    `SELECT id, password_hash FROM users WHERE id = $1 AND deleted_at IS NULL`,
    [userId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('User not found.');
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) {
    throw new UnauthorizedError('Current password is incorrect.');
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await db.query(
    `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
    [passwordHash, userId]
  );
};

const getAddressesByUserId = async (userId) => {
  const result = await db.query(
    `SELECT id, user_id, label, first_name, last_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default, created_at, updated_at
     FROM user_addresses WHERE user_id = $1 AND deleted_at IS NULL ORDER BY is_default DESC, created_at DESC`,
    [userId]
  );
  return result.rows;
};

const getAddressById = async (userId, addressId) => {
  const result = await db.query(
    `SELECT id, user_id, label, first_name, last_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default, created_at, updated_at
     FROM user_addresses WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
    [addressId, userId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('Address not found.');
  }
  return result.rows[0];
};

const createAddress = async (userId, payload) => {
  const {
    label,
    first_name,
    last_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    is_default = false,
  } = payload;

  if (is_default) {
    await db.query(
      `UPDATE user_addresses SET is_default = false WHERE user_id = $1 AND deleted_at IS NULL`,
      [userId]
    );
  }

  const result = await db.query(
    `INSERT INTO user_addresses (user_id, label, first_name, last_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
     RETURNING id, user_id, label, first_name, last_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default, created_at, updated_at`,
    [userId, label, first_name, last_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default]
  );
  return result.rows[0];
};

const updateAddress = async (userId, addressId, payload) => {
  await getAddressById(userId, addressId);

  const {
    label,
    first_name,
    last_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    is_default,
  } = payload;

  if (is_default) {
    await db.query(
      `UPDATE user_addresses SET is_default = false WHERE user_id = $1 AND deleted_at IS NULL`,
      [userId]
    );
  }

  const result = await db.query(
    `UPDATE user_addresses
     SET label = $1, first_name = $2, last_name = $3, phone = $4, address_line1 = $5, address_line2 = $6,
         city = $7, state = $8, postal_code = $9, country = $10, is_default = $11, updated_at = NOW()
     WHERE id = $12 AND user_id = $13 AND deleted_at IS NULL
     RETURNING id, user_id, label, first_name, last_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default, created_at, updated_at`,
    [label, first_name, last_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default, addressId, userId]
  );

  if (!result.rows.length) {
    throw new NotFoundError('Address not found.');
  }
  return result.rows[0];
};

const deleteAddress = async (userId, addressId) => {
  const result = await db.query(
    `UPDATE user_addresses SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL RETURNING id`,
    [addressId, userId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('Address not found.');
  }
};

module.exports = {
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  changePassword,
  getAddressesByUserId,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};
