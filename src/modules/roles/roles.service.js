const db = require('../../db');

/**
 * Retrieve all roles.
 * @returns {Promise<Array>}
 */
const getAllRoles = async () => {
  const result = await db.query(
    'SELECT id, name, description, permissions, created_at, updated_at FROM roles ORDER BY created_at ASC'
  );
  return result.rows;
};

/**
 * Create a new role.
 * @param {Object} params
 * @param {string} params.name
 * @param {string} [params.description]
 * @param {Array} [params.permissions]
 * @returns {Promise<Object>}
 */
const createRole = async ({ name, description = null, permissions = [] }) => {
  const result = await db.query(
    `INSERT INTO roles (name, description, permissions, created_at, updated_at)
     VALUES ($1, $2, $3, NOW(), NOW())
     RETURNING id, name, description, permissions, created_at, updated_at`,
    [name, description, JSON.stringify(permissions)]
  );
  return result.rows[0];
};

/**
 * Retrieve a role by its ID.
 * @param {string|number} roleId
 * @returns {Promise<Object|null>}
 */
const getRoleById = async (roleId) => {
  const result = await db.query(
    'SELECT id, name, description, permissions, created_at, updated_at FROM roles WHERE id = $1',
    [roleId]
  );
  return result.rows[0] || null;
};

/**
 * Update an existing role.
 * @param {string|number} roleId
 * @param {Object} params
 * @param {string} [params.name]
 * @param {string} [params.description]
 * @param {Array} [params.permissions]
 * @returns {Promise<Object|null>}
 */
const updateRole = async (roleId, { name, description, permissions }) => {
  const existing = await getRoleById(roleId);
  if (!existing) return null;

  const updatedName = name !== undefined ? name : existing.name;
  const updatedDescription = description !== undefined ? description : existing.description;
  const updatedPermissions = permissions !== undefined ? permissions : existing.permissions;

  const result = await db.query(
    `UPDATE roles
     SET name = $1, description = $2, permissions = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING id, name, description, permissions, created_at, updated_at`,
    [updatedName, updatedDescription, JSON.stringify(updatedPermissions), roleId]
  );
  return result.rows[0] || null;
};

/**
 * Delete a role by its ID.
 * @param {string|number} roleId
 * @returns {Promise<boolean>}
 */
const deleteRole = async (roleId) => {
  const result = await db.query(
    'DELETE FROM roles WHERE id = $1 RETURNING id',
    [roleId]
  );
  return result.rowCount > 0;
};

/**
 * Get all users associated with a given role.
 * @param {string|number} roleId
 * @returns {Promise<Array>}
 */
const getUsersByRole = async (roleId) => {
  const result = await db.query(
    `SELECT u.id, u.email, u.first_name, u.last_name, ur.assigned_at
     FROM users u
     INNER JOIN user_roles ur ON u.id = ur.user_id
     WHERE ur.role_id = $1
     ORDER BY ur.assigned_at ASC`,
    [roleId]
  );
  return result.rows;
};

/**
 * Assign a role to a user.
 * @param {Object} params
 * @param {string|number} params.userId
 * @param {string|number} params.roleId
 * @returns {Promise<Object>}
 */
const assignRoleToUser = async ({ userId, roleId }) => {
  const result = await db.query(
    `INSERT INTO user_roles (user_id, role_id, assigned_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (user_id, role_id) DO NOTHING
     RETURNING user_id, role_id, assigned_at`,
    [userId, roleId]
  );
  if (result.rowCount === 0) {
    const existing = await db.query(
      'SELECT user_id, role_id, assigned_at FROM user_roles WHERE user_id = $1 AND role_id = $2',
      [userId, roleId]
    );
    return existing.rows[0];
  }
  return result.rows[0];
};

/**
 * Remove a role from a user.
 * @param {Object} params
 * @param {string|number} params.userId
 * @param {string|number} params.roleId
 * @returns {Promise<boolean>}
 */
const removeRoleFromUser = async ({ userId, roleId }) => {
  const result = await db.query(
    'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2 RETURNING user_id',
    [userId, roleId]
  );
  return result.rowCount > 0;
};

/**
 * Get all roles assigned to a specific user.
 * @param {string|number} userId
 * @returns {Promise<Array>}
 */
const getRolesByUser = async (userId) => {
  const result = await db.query(
    `SELECT r.id, r.name, r.description, r.permissions, ur.assigned_at
     FROM roles r
     INNER JOIN user_roles ur ON r.id = ur.role_id
     WHERE ur.user_id = $1
     ORDER BY ur.assigned_at ASC`,
    [userId]
  );
  return result.rows;
};

module.exports = {
  getAllRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
  getUsersByRole,
  assignRoleToUser,
  removeRoleFromUser,
  getRolesByUser,
};
