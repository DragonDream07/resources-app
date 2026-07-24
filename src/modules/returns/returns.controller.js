const returnsService = require('./returns.service');

/**
 * POST /orders/:orderId/return-requests
 * Initiate a return request for an order.
 */
async function createReturnRequest(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const payload = req.body;
    const returnRequest = await returnsService.createReturnRequest(orderId, userId, payload);
    return res.status(201).json({ data: returnRequest });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /return-requests
 * Admin: list all return requests with optional filters.
 */
async function listReturnRequests(req, res, next) {
  try {
    const filters = req.query;
    const result = await returnsService.listReturnRequests(filters);
    return res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /return-requests/:returnRequestId
 * Get a single return request by ID.
 */
async function getReturnRequest(req, res, next) {
  try {
    const { returnRequestId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const returnRequest = await returnsService.getReturnRequest(returnRequestId, userId, userRole);
    return res.status(200).json({ data: returnRequest });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /return-requests/:returnRequestId/review
 * Admin: approve or reject a return request.
 */
async function reviewReturnRequest(req, res, next) {
  try {
    const { returnRequestId } = req.params;
    const adminId = req.user.id;
    const payload = req.body;
    const result = await returnsService.reviewReturnRequest(returnRequestId, adminId, payload);
    return res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createReturnRequest,
  listReturnRequests,
  getReturnRequest,
  reviewReturnRequest,
};
