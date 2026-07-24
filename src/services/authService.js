import api from './api';

export const register = (data) =>
  api.post('/auth/register', data).then((res) => res.data);

export const guestRegister = (data) =>
  api.post('/auth/guest-register', data).then((res) => res.data);

export const login = (data) =>
  api.post('/auth/login', data).then((res) => {
    const { accessToken, refreshToken } = res.data;
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    return res.data;
  });

export const logout = () =>
  api.post('/auth/logout').finally(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  });

export const forgotPassword = (data) =>
  api.post('/auth/forgot-password', data).then((res) => res.data);

export const resetPassword = (data) =>
  api.post('/auth/reset-password', data).then((res) => res.data);

export default {
  register,
  guestRegister,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
