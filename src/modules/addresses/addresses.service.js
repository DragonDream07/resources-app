const db = require('../../config/db');

async function getAddresses(userId) {
  const { rows } = await db.query(
    `SELECT * FROM addresses WHERE user_id = $1 AND deleted_at IS NULL ORDER BY is_default DESC, created_at DESC`,
    [userId]
  );
  return rows;
}

async function getAddressById(userId, addressId) {
  const { rows } = await db.query(
    `SELECT * FROM addresses WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
    [addressId, userId]
  );
  if (!rows.length) {
    const err = new Error('Address not found.');
    err.statusCode = 404;
    throw err;
  }
  return rows[0];
}

async function checkServiceability(pinCode) {
  const { rows } = await db.query(
    `SELECT id FROM serviceable_pin_codes WHERE pin_code = $1 AND is_active = true`,
    [pinCode]
  );
  return rows.length > 0;
}

async function createAddress(userId, payload) {
  const {
    full_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    pin_code,
    country,
    is_default,
  } = payload;

  const isServiceable = await checkServiceability(pin_code);
  if (!isServiceable) {
    const err = new Error('Delivery is not available at this pin code.');
    err.statusCode = 422;
    throw err;
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    if (is_default) {
      await client.query(
        `UPDATE addresses SET is_default = false WHERE user_id = $1 AND deleted_at IS NULL`,
        [userId]
      );
    }

    const existingDefaults = await client.query(
      `SELECT id FROM addresses WHERE user_id = $1 AND is_default = true AND deleted_at IS NULL`,
      [userId]
    );
    const makeDefault = is_default || existingDefaults.rows.length === 0;

    const { rows } = await client.query(
      `INSERT INTO addresses
        (user_id, full_name, phone, address_line1, address_line2, city, state, pin_code, country, is_default, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
       RETURNING *`,
      [userId, full_name, phone, address_line1, address_line2 || null, city, state, pin_code, country || 'India', makeDefault]
    );

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function updateAddress(userId, addressId, payload) {
  const existing = await getAddressById(userId, addressId);

  const {
    full_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    pin_code,
    country,
    is_default,
  } = payload;

  const newPinCode = pin_code !== undefined ? pin_code : existing.pin_code;

  if (pin_code && pin_code !== existing.pin_code) {
    const isServiceable = await checkServiceability(pin_code);
    if (!isServiceable) {
      const err = new Error('Delivery is not available at this pin code.');
      err.statusCode = 422;
      throw err;
    }
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    if (is_default) {
      await client.query(
        `UPDATE addresses SET is_default = false WHERE user_id = $1 AND deleted_at IS NULL`,
        [userId]
      );
    }

    const { rows } = await client.query(
      `UPDATE addresses SET
        full_name     = COALESCE($1, full_name),
        phone         = COALESCE($2, phone),
        address_line1 = COALESCE($3, address_line1),
        address_line2 = COALESCE($4, address_line2),
        city          = COALESCE($5, city),
        state         = COALESCE($6, state),
        pin_code      = COALESCE($7, pin_code),
        country       = COALESCE($8, country),
        is_default    = COALESCE($9, is_default),
        updated_at    = NOW()
       WHERE id = $10 AND user_id = $11 AND deleted_at IS NULL
       RETURNING *`,
      [
        full_name || null,
        phone || null,
        address_line1 || null,
        address_line2 !== undefined ? address_line2 : null,
        city || null,
        state || null,
        newPinCode || null,
        country || null,
        is_default !== undefined ? is_default : null,
        addressId,
        userId,
      ]
    );

    if (!rows.length) {
      await client.query('ROLLBACK');
      const err = new Error('Address not found.');
      err.statusCode = 404;
      throw err;
    }

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function deleteAddress(userId, addressId) {
  const existing = await getAddressById(userId, addressId);

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE addresses SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND user_id = $2`,
      [addressId, userId]
    );

    if (existing.is_default) {
      const { rows: remaining } = await client.query(
        `SELECT id FROM addresses WHERE user_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 1`,
        [userId]
      );
      if (remaining.length) {
        await client.query(
          `UPDATE addresses SET is_default = true, updated_at = NOW() WHERE id = $1`,
          [remaining[0].id]
        );
      }
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  checkServiceability,
};
