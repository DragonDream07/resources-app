import api from './api';

export const getNotifications = (params) =>
  api.get('/notifications', { params }).then((res) => res.data);

export const markNotificationRead = (notificationId) =>
  api.post(`/notifications/${notificationId}/read`).then((res) => res.data);

export const markAllNotificationsRead = () =>
  api.post('/notifications/read-all').then((res) => res.data);

export default {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};
