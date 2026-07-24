'use strict';

const adminService = require('./admin.service');

// ── Reports ───────────────────────────────────────────────────────────────────

async function getReports(req, res, next) {
  try {
    const { from, to, type } = req.query;
    const data = await adminService.buildReports({ from, to, type });
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return next(err);
  }
}

// ── Dashboard stats ───────────────────────────────────────────────────────────

async function getDashboardStats(req, res, next) {
  try {
    const stats = await adminService.aggregateDashboardStats();
    return res.status(200).json({ success: true, data: stats });
  } catch (err) {
    return next(err);
  }
}

// ── Permissions ───────────────────────────────────────────────────────────────

async function getPermissions(req, res, next) {
  try {
    const permissions = await adminService.listPermissions();
    return res.status(200).json({ success: true, data: permissions });
  } catch (err) {
    return next(err);
  }
}

// ── Roles ─────────────────────────────────────────────────────────────────────

async function getRoles(req, res, next) {
  try {
    const roles = await adminService.listRoles();
    return res.status(200).json({ success: true, data: roles });
  } catch (err) {
    return next(err);
  }
}

async function createRole(req, res, next) {
  try {
    const role = await adminService.createRole(req.body);
    return res.status(201).json({ success: true, data: role });
  } catch (err) {
    return next(err);
  }
}

async function getRoleById(req, res, next) {
  try {
    const role = await adminService.getRoleById(req.params.roleId);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found.' });
    }
    return res.status(200).json({ success: true, data: role });
  } catch (err) {
    return next(err);
  }
}

async function updateRole(req, res, next) {
  try {
    const role = await adminService.updateRole(req.params.roleId, req.body);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found.' });
    }
    return res.status(200).json({ success: true, data: role });
  } catch (err) {
    return next(err);
  }
}

async function deleteRole(req, res, next) {
  try {
    await adminService.deleteRole(req.params.roleId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

// ── Role permissions ──────────────────────────────────────────────────────────

async function getRolePermissions(req, res, next) {
  try {
    const permissions = await adminService.listRolePermissions(req.params.roleId);
    return res.status(200).json({ success: true, data: permissions });
  } catch (err) {
    return next(err);
  }
}

async function addPermissionToRole(req, res, next) {
  try {
    const result = await adminService.addPermissionToRole(
      req.params.roleId,
      req.body.permissionId
    );
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    return next(err);
  }
}

async function removePermissionFromRole(req, res, next) {
  try {
    await adminService.removePermissionFromRole(
      req.params.roleId,
      req.params.permissionId
    );
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

// ── Serviceable pin codes ─────────────────────────────────────────────────────

async function getServiceablePinCodes(req, res, next) {
  try {
    const { page = 1, limit = 50 } = req.query;
    const data = await adminService.listServiceablePinCodes({
      page: Number(page),
      limit: Number(limit),
    });
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return next(err);
  }
}

async function createServiceablePinCode(req, res, next) {
  try {
    const pinCode = await adminService.createServiceablePinCode(req.body);
    return res.status(201).json({ success: true, data: pinCode });
  } catch (err) {
    return next(err);
  }
}

async function updateServiceablePinCode(req, res, next) {
  try {
    const pinCode = await adminService.updateServiceablePinCode(
      req.params.pinCodeId,
      req.body
    );
    if (!pinCode) {
      return res.status(404).json({ success: false, message: 'Pin code not found.' });
    }
    return res.status(200).json({ success: true, data: pinCode });
  } catch (err) {
    return next(err);
  }
}

async function deleteServiceablePinCode(req, res, next) {
  try {
    await adminService.deleteServiceablePinCode(req.params.pinCodeId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getReports,
  getDashboardStats,
  getPermissions,
  getRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
  getRolePermissions,
  addPermissionToRole,
  removePermissionFromRole,
  getServiceablePinCodes,
  createServiceablePinCode,
  updateServiceablePinCode,
  deleteServiceablePinCode,
};
