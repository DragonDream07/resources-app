'use strict';

const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const rolesController = require('../roles/roles.controller');

/**
 * Inline RBAC middleware — verifies the authenticated user has the "admin" role.
 * Replace with your shared middleware import if one is centralised later.
 */
function requireAdmin(req, res, next) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  const roles = user.roles || [];
  const isAdmin = roles.some(
    (r) => (typeof r === 'string' ? r : r.name || r.slug || '') === 'admin'
  );
  if (!isAdmin) {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
  return next();
}

// Apply admin RBAC to all routes in this router
router.use(requireAdmin);

// ── Reports ──────────────────────────────────────────────────────────────────
router.get('/reports', adminController.getReports);

// ── Dashboard stats ───────────────────────────────────────────────────────────
router.get('/dashboard', adminController.getDashboardStats);

// ── Permissions ───────────────────────────────────────────────────────────────
router.get('/permissions', adminController.getPermissions);

// ── Roles ─────────────────────────────────────────────────────────────────────
router.get('/roles', adminController.getRoles);
router.post('/roles', adminController.createRole);
router.get('/roles/:roleId', adminController.getRoleById);
router.put('/roles/:roleId', adminController.updateRole);
router.delete('/roles/:roleId', adminController.deleteRole);

// ── Role permissions ─────────────────────────────────────────────────────────
router.get('/roles/:roleId/permissions', adminController.getRolePermissions);
router.post('/roles/:roleId/permissions', adminController.addPermissionToRole);
router.delete(
  '/roles/:roleId/permissions/:permissionId',
  adminController.removePermissionFromRole
);

// ── Serviceable pin codes ─────────────────────────────────────────────────────
router.get('/serviceable-pin-codes', adminController.getServiceablePinCodes);
router.post('/serviceable-pin-codes', adminController.createServiceablePinCode);
router.put('/serviceable-pin-codes/:pinCodeId', adminController.updateServiceablePinCode);
router.delete('/serviceable-pin-codes/:pinCodeId', adminController.deleteServiceablePinCode);

module.exports = router;
