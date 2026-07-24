const express = require('express');
const router = express.Router();
const rolesController = require('./roles.controller');

// Role CRUD
router.get('/', rolesController.getAllRoles);
router.post('/', rolesController.createRole);
router.get('/:roleId', rolesController.getRoleById);
router.put('/:roleId', rolesController.updateRole);
router.delete('/:roleId', rolesController.deleteRole);

// User-role assignment
router.get('/:roleId/users', rolesController.getUsersByRole);
router.post('/assign', rolesController.assignRoleToUser);
router.delete('/assign', rolesController.removeRoleFromUser);
router.get('/user/:userId', rolesController.getRolesByUser);

module.exports = router;
