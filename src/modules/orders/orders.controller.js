const ordersService = require('./orders.service');

async function listOrders(req, res, next) {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const filters = {
      status: req.query.status,
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
      userId: isAdmin ? req.query.userId : userId,
      isAdmin,
    };
    const result = await ordersService.listOrders(filters);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const order = await ordersService.getOrder(orderId, userId, isAdmin);
    return res.status(200).json(order);
  } catch (err) {
    next(err);
  }
}

async function getOrderTimeline(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const timeline = await ordersService.getOrderTimeline(orderId, userId, isAdmin);
    return res.status(200).json(timeline);
  } catch (err) {
    next(err);
  }
}

async function getOrderTracking(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const tracking = await ordersService.getOrderTracking(orderId, userId, isAdmin);
    return res.status(200).json(tracking);
  } catch (err) {
    next(err);
  }
}

async function getOrderRefunds(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const refunds = await ordersService.getOrderRefunds(orderId, userId, isAdmin);
    return res.status(200).json(refunds);
  } catch (err) {
    next(err);
  }
}

async function cancelOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const { reason } = req.body;
    const order = await ordersService.cancelOrder(orderId, userId, isAdmin, reason);
    return res.status(200).json(order);
  } catch (err) {
    next(err);
  }
}

async function advanceOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, carrier, trackingUrl } = req.body;
    const order = await ordersService.advanceOrder(orderId, status, { trackingNumber, carrier, trackingUrl });
    return res.status(200).json(order);
  } catch (err) {
    next(err);
  }
}

async function createReturnRequest(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const { items, reason, notes } = req.body;
    const returnRequest = await ordersService.createReturnRequest(orderId, userId, { items, reason, notes });
    return res.status(201).json(returnRequest);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listOrders,
  getOrder,
  getOrderTimeline,
  getOrderTracking,
  getOrderRefunds,
  cancelOrder,
  advanceOrder,
  createReturnRequest,
};
