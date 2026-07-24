import api from './api';

// Customer endpoints
export const getReturnRequest = (returnRequestId) =>
  api.get(`/return-requests/${returnRequestId}`).then((res) => res.data);

// Admin endpoints
export const adminGetReturnRequests = (params) =>
  api.get('/return-requests', { params }).then((res) => res.data);

export const adminReviewReturnRequest = (returnRequestId, data) =>
  api.post(`/return-requests/${returnRequestId}/review`, data).then((res) => res.data);

export default {
  getReturnRequest,
  adminGetReturnRequests,
  adminReviewReturnRequest,
};
