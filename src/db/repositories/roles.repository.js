const db = require('../client');

const ROLES_TABLE = 'roles';
const USER_ROLES_TABLE = 'user_roles';

async function findRoleById(id) {
  return db(ROLES_TABLE).where({ id }).first();
}

async function findRoleByName(name) {
  return db(ROLES_TABLE).where({ name }).first();
}

async function listRoles() {
  return db(ROLES_TABLE).select('*');
}

async function createRole(data) {
  const [id] = await db(ROLES_TABLE).insert(data);
  return findRoleById(id);
}

async function assignRoleToUser(user_id, role_id) {
  await db(USER_ROLES_TABLE)
    .insert({ user_id, role_id })
    .onConflict(['user_id', 'role_id'])
    .ignore();
}

async function removeRoleFromUser(user_id, role_id) {
  return db(USER_ROLES_TABLE).where({ user_id, role_id }).delete();
}

async function getRolesForUser(user_id) {
  return db(USER_ROLES_TABLE)
    .join(ROLES_TABLE, `${USER_ROLES_TABLE}.role_id`, `${ROLES_TABLE}.id`)
    .where(`${USER_ROLES_TABLE}.user_id`, user_id)
    .select(`${ROLES_TABLE}.*`);
}

async function getUsersForRole(role_id) {
  return db(USER_ROLES_TABLE)
    .where({ role_id })
    .select('user_id');
}

async function deleteUserRoles(user_id) {
  return db(USER_ROLES_TABLE).where({ user_id }).delete();
}

module.exports = {
  findRoleById,
  findRoleByName,
  listRoles,
  createRole,
  assignRoleToUser,
  removeRoleFromUser,
  getRolesForUser,
  getUsersForRole,
  deleteUserRoles,
};
