import api from './api';

export const getPromoCodes = (params) =>
  api.get('/promo-codes', { params }).then((res) => res.data);

// Admin CRUD
export const adminGetPromoCodes = (params) =>
  api.get('/admin/promo-codes', { params }).then((res) => res.data);

export const adminCreatePromoCode = (data) =>
  api.post('/admin/promo-codes', data).then((res) => res.data);

export const adminUpdatePromoCode = (promoCodeId, data) =>
  api.put(`/admin/promo-codes/${promoCodeId}`, data).then((res) => res.data);

export const adminDeletePromoCode = (promoCodeId) =>
  api.delete(`/admin/promo-codes/${promoCodeId}`).then((res) => res.data);

export default {
  getPromoCodes,
  adminGetPromoCodes,
  adminCreatePromoCode,
  adminUpdatePromoCode,
  adminDeletePromoCode,
};
