const express = require('express');
const router = express.Router({ mergeParams: true });
const returnsController = require('./returns.controller');
const { validateCreateReturnRequest, validateReviewReturnRequest } = require('./returns.validator');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// Customer: POST /orders/:orderId/return-requests
router.post(
  '/orders/:orderId/return-requests',
  authenticate,
  validateCreateReturnRequest,
  returnsController.createReturnRequest
);

// Admin: GET /return-requests
router.get(
  '/return-requests',
  authenticate,
  authorize('admin'),
  returnsController.listReturnRequests
);

// Admin/Customer: GET /return-requests/:returnRequestId
router.get(
  '/return-requests/:returnRequestId',
  authenticate,
  returnsController.getReturnRequest
);

// Admin: POST /return-requests/:returnRequestId/review
router.post(
  '/return-requests/:returnRequestId/review',
  authenticate,
  authorize('admin'),
  validateReviewReturnRequest,
  returnsController.reviewReturnRequest
);

module.exports = router;
