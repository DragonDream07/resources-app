'use strict';

/**
 * admin.service.js
 *
 * Cross-domain read aggregations for the admin dashboard and reports.
 * Delegates to domain services/repositories where they exist; uses the
 * shared DB connection (knex) for queries that span multiple tables.
 */

const db = require('../../config/db');

// ─── Domain service imports ────────────────────────────────────────────────
const ordersService = require('../orders/orders.service');
const returnsService = require('../returns/returns.service');
const usersService = require('../users/users.service');
const rolesService = require('../roles/roles.service');

// ─── Reports ──────────────────────────────────────────────────────────────────

/**
 * Build aggregated report data.
 * @param {object} opts
 * @param {string} [opts.from]  ISO date string — start of period
 * @param {string} [opts.to]    ISO date string — end of period
 * @param {string} [opts.type]  Report type discriminator (orders|revenue|returns)
 */
async function buildReports({ from, to, type } = {}) {
  const dateFilter = (qb, column) => {
    if (from) qb.where(column, '>=', new Date(from));
    if (to) qb.where(column, '<=', new Date(to));
  };

  const [ordersReport, revenueReport, returnsReport] = await Promise.all([
    // Orders summary
    db('orders')
      .modify((qb) => dateFilter(qb, 'created_at'))
      .count('id as total_orders')
      .sum('grand_total as total_revenue')
      .avg('grand_total as avg_order_value')
      .first(),

    // Revenue by status
    db('orders')
      .modify((qb) => dateFilter(qb, 'created_at'))
      .select('status')
      .count('id as count')
      .sum('grand_total as revenue')
      .groupBy('status'),

    // Returns summary
    db('return_requests')
      .modify((qb) => dateFilter(qb, 'created_at'))
      .count('id as total_returns')
      .first(),
  ]);

  return {
    period: { from: from || null, to: to || null },
    orders: {
      total: Number(ordersReport.total_orders) || 0,
      total_revenue: Number(ordersReport.total_revenue) || 0,
      avg_order_value: Number(ordersReport.avg_order_value) || 0,
      by_status: revenueReport,
    },
    returns: {
      total: Number(returnsReport.total_returns) || 0,
    },
  };
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

async function aggregateDashboardStats() {
  const [totalOrders, totalUsers, totalRevenue, pendingReturns, activeRoles] =
    await Promise.all([
      db('orders').count('id as count').first(),
      db('users').count('id as count').first(),
      db('orders')
        .whereIn('status', ['delivered', 'completed'])
        .sum('grand_total as total')
        .first(),
      db('return_requests').where('status', 'pending').count('id as count').first(),
      db('roles').where('is_active', true).count('id as count').first(),
    ]);

  return {
    total_orders: Number(totalOrders.count) || 0,
    total_users: Number(totalUsers.count) || 0,
    total_revenue: Number(totalRevenue.total) || 0,
    pending_returns: Number(pendingReturns.count) || 0,
    active_roles: Number(activeRoles.count) || 0,
  };
}

// ─── Permissions ──────────────────────────────────────────────────────────────

async function listPermissions() {
  return db('permissions').select('*').orderBy('name', 'asc');
}

// ─── Roles (delegates to roles service) ──────────────────────────────────────

async function listRoles() {
  return rolesService.listRoles();
}

async function createRole(payload) {
  return rolesService.createRole(payload);
}

async function getRoleById(roleId) {
  return rolesService.getRoleById(roleId);
}

async function updateRole(roleId, payload) {
  return rolesService.updateRole(roleId, payload);
}

async function deleteRole(roleId) {
  return rolesService.deleteRole(roleId);
}

// ─── Role permissions ─────────────────────────────────────────────────────────

async function listRolePermissions(roleId) {
  return db('role_permissions')
    .join('permissions', 'role_permissions.permission_id', 'permissions.id')
    .where('role_permissions.role_id', roleId)
    .select(
      'permissions.id',
      'permissions.name',
      'permissions.slug',
      'permissions.description'
    )
    .orderBy('permissions.name', 'asc');
}

async function addPermissionToRole(roleId, permissionId) {
  // Upsert — ignore duplicate assignments
  await db('role_permissions')
    .insert({ role_id: roleId, permission_id: permissionId })
    .onConflict(['role_id', 'permission_id'])
    .ignore();

  return db('permissions').where('id', permissionId).first();
}

async function removePermissionFromRole(roleId, permissionId) {
  await db('role_permissions')
    .where({ role_id: roleId, permission_id: permissionId })
    .delete();
}

// ─── Serviceable pin codes ────────────────────────────────────────────────────

async function listServiceablePinCodes({ page = 1, limit = 50 } = {}) {
  const offset = (page - 1) * limit;

  const [rows, countRow] = await Promise.all([
    db('serviceable_pin_codes')
      .select('*')
      .orderBy('pin_code', 'asc')
      .limit(limit)
      .offset(offset),
    db('serviceable_pin_codes').count('id as count').first(),
  ]);

  return {
    items: rows,
    pagination: {
      page,
      limit,
      total: Number(countRow.count) || 0,
    },
  };
}

async function createServiceablePinCode(payload) {
  const { pin_code, city, state, is_active = true } = payload;
  const [id] = await db('serviceable_pin_codes').insert({
    pin_code,
    city,
    state,
    is_active,
  });
  return db('serviceable_pin_codes').where('id', id).first();
}

async function updateServiceablePinCode(pinCodeId, payload) {
  const { pin_code, city, state, is_active } = payload;
  const updateData = {};
  if (pin_code !== undefined) updateData.pin_code = pin_code;
  if (city !== undefined) updateData.city = city;
  if (state !== undefined) updateData.state = state;
  if (is_active !== undefined) updateData.is_active = is_active;

  const count = await db('serviceable_pin_codes')
    .where('id', pinCodeId)
    .update(updateData);

  if (!count) return null;
  return db('serviceable_pin_codes').where('id', pinCodeId).first();
}

async function deleteServiceablePinCode(pinCodeId) {
  await db('serviceable_pin_codes').where('id', pinCodeId).delete();
}

module.exports = {
  buildReports,
  aggregateDashboardStats,
  listPermissions,
  listRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
  listRolePermissions,
  addPermissionToRole,
  removePermissionFromRole,
  listServiceablePinCodes,
  createServiceablePinCode,
  updateServiceablePinCode,
  deleteServiceablePinCode,
};
