const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');
const { validateUpdateMe, validateChangePassword, validateUpdateUser, validateAddress } = require('./users.validator');
const { authenticate, authorize } = require('../../middleware/auth');

// Me routes
router.get('/me', authenticate, usersController.getMe);
router.patch('/me', authenticate, validateUpdateMe, usersController.updateMe);
router.post('/me/change-password', authenticate, validateChangePassword, usersController.changePassword);

// Me address routes
router.get('/me/addresses', authenticate, usersController.getMyAddresses);
router.post('/me/addresses', authenticate, validateAddress, usersController.createMyAddress);
router.get('/me/addresses/:addressId', authenticate, usersController.getMyAddress);
router.put('/me/addresses/:addressId', authenticate, validateAddress, usersController.updateMyAddress);
router.delete('/me/addresses/:addressId', authenticate, usersController.deleteMyAddress);

// Admin user management routes
router.get('/', authenticate, authorize('admin'), usersController.getUsers);
router.get('/:userId', authenticate, authorize('admin'), usersController.getUserById);
router.patch('/:userId', authenticate, authorize('admin'), validateUpdateUser, usersController.updateUser);
router.delete('/:userId', authenticate, authorize('admin'), usersController.deleteUser);

module.exports = router;
