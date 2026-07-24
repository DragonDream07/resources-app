import api from './api';

export const getCheckoutReview = (params) =>
  api.get('/checkout/review', { params }).then((res) => res.data);

export const setCheckoutAddress = (data) =>
  api.post('/checkout/address', data).then((res) => res.data);

export const placeOrder = (data) =>
  api.post('/checkout/place-order', data).then((res) => res.data);

export default {
  getCheckoutReview,
  setCheckoutAddress,
  placeOrder,
};
