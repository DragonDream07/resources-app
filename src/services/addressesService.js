import api from './api';

export const getAddresses = () =>
  api.get('/users/me/addresses').then((res) => res.data);

export const getAddress = (addressId) =>
  api.get(`/users/me/addresses/${addressId}`).then((res) => res.data);

export const createAddress = (data) =>
  api.post('/users/me/addresses', data).then((res) => res.data);

export const updateAddress = (addressId, data) =>
  api.put(`/users/me/addresses/${addressId}`, data).then((res) => res.data);

export const deleteAddress = (addressId) =>
  api.delete(`/users/me/addresses/${addressId}`).then((res) => res.data);

export const checkServiceability = (params) =>
  api.get('/serviceability', { params }).then((res) => res.data);

export default {
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  checkServiceability,
};
