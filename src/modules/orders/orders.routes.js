const express = require('express');
const router = express.Router();
const ordersController = require('./orders.controller');
const { validateAdvanceOrder, validateCancelOrder, validateReturnRequest } = require('./orders.validator');
const { requireAuth, requireRole } = require('../../middleware/auth.middleware');

// Customer routes
router.get('/', requireAuth, ordersController.listOrders);
router.get('/:orderId', requireAuth, ordersController.getOrder);
router.get('/:orderId/timeline', requireAuth, ordersController.getOrderTimeline);
router.get('/:orderId/tracking', requireAuth, ordersController.getOrderTracking);
router.get('/:orderId/refunds', requireAuth, ordersController.getOrderRefunds);
router.post('/:orderId/cancel', requireAuth, validateCancelOrder, ordersController.cancelOrder);
router.post('/:orderId/advance', requireAuth, requireRole('admin'), validateAdvanceOrder, ordersController.advanceOrder);
router.post('/:orderId/return-requests', requireAuth, validateReturnRequest, ordersController.createReturnRequest);

module.exports = router;
