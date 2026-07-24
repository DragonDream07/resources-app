import { useState, useEffect, useCallback } from 'react';
import notificationsService from '../services/notificationsService';

const POLL_INTERVAL_MS = 30000;

export function useNotifications() {
  const [list, setList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationsService.getNotifications();
      const notifications = Array.isArray(data) ? data : (data.items || []);
      setList(notifications);
      setUnreadCount(notifications.filter((n) => !n.read).length);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markRead = useCallback(async (notificationId) => {
    try {
      await notificationsService.markNotificationRead(notificationId);
      setList((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError(err);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await notificationsService.markAllNotificationsRead();
      setList((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      setError(err);
    }
  }, []);

  return { list, unreadCount, markRead, markAllRead, loading, error, refresh: fetchNotifications };
}
