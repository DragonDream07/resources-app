const express = require('express');
const router = express.Router();
const notificationsController = require('./notifications.controller');
const { authenticate } = require('../../middleware/auth.middleware');

router.use(authenticate);

router.get('/', notificationsController.getNotifications);
router.get('/:notificationId', notificationsController.getNotificationById);
router.post('/read-all', notificationsController.markAllRead);
router.post('/:notificationId/read', notificationsController.markOneRead);

module.exports = router;
