import api from './api';

export const initiatePayment = (data) =>
  api.post('/payments/initiate', data).then((res) => res.data);

// confirmPayment surfaces mock adapter outcomes returned by the backend
export const confirmPayment = (data) =>
  api.post('/payments/confirm', data).then((res) => res.data);

export default {
  initiatePayment,
  confirmPayment,
};
