import api from './api';

// Customer endpoints
export const getOrders = (params) =>
  api.get('/orders', { params }).then((res) => res.data);

export const getOrder = (orderId) =>
  api.get(`/orders/${orderId}`).then((res) => res.data);

export const getOrderTimeline = (orderId) =>
  api.get(`/orders/${orderId}/timeline`).then((res) => res.data);

export const getOrderTracking = (orderId) =>
  api.get(`/orders/${orderId}/tracking`).then((res) => res.data);

export const getOrderRefunds = (orderId) =>
  api.get(`/orders/${orderId}/refunds`).then((res) => res.data);

export const cancelOrder = (orderId, data) =>
  api.post(`/orders/${orderId}/cancel`, data).then((res) => res.data);

export const createReturnRequest = (orderId, data) =>
  api.post(`/orders/${orderId}/return-requests`, data).then((res) => res.data);

// Admin endpoints
export const adminGetOrders = (params) =>
  api.get('/admin/orders', { params }).then((res) => res.data);

export const adminGetOrder = (orderId) =>
  api.get(`/admin/orders/${orderId}`).then((res) => res.data);

export const adminAdvanceOrder = (orderId, data) =>
  api.post(`/orders/${orderId}/advance`, data).then((res) => res.data);

export default {
  getOrders,
  getOrder,
  getOrderTimeline,
  getOrderTracking,
  getOrderRefunds,
  cancelOrder,
  createReturnRequest,
  adminGetOrders,
  adminGetOrder,
  adminAdvanceOrder,
};
