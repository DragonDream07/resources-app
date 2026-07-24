import api from './api';

export const getMe = () =>
  api.get('/users/me').then((res) => res.data);

export const updateMe = (data) =>
  api.patch('/users/me', data).then((res) => res.data);

export const changePassword = (data) =>
  api.post('/users/me/change-password', data).then((res) => res.data);

// Admin CRUD
export const adminGetUsers = (params) =>
  api.get('/admin/users', { params }).then((res) => res.data);

export const adminGetUser = (userId) =>
  api.get(`/admin/users/${userId}`).then((res) => res.data);

export const adminUpdateUser = (userId, data) =>
  api.put(`/admin/users/${userId}`, data).then((res) => res.data);

export const adminDeleteUser = (userId) =>
  api.delete(`/admin/users/${userId}`).then((res) => res.data);

export default {
  getMe,
  updateMe,
  changePassword,
  adminGetUsers,
  adminGetUser,
  adminUpdateUser,
  adminDeleteUser,
};
