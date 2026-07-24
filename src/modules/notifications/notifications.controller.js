const notificationsService = require('./notifications.service');

const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page, limit, unread } = req.query;
    const options = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      unread: unread === 'true' ? true : unread === 'false' ? false : undefined,
    };
    const result = await notificationsService.getNotifications(userId, options);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getNotificationById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;
    const notification = await notificationsService.getNotificationById(userId, notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    return res.status(200).json(notification);
  } catch (err) {
    next(err);
  }
};

const markAllRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await notificationsService.markAllRead(userId);
    return res.status(200).json({ message: 'All notifications marked as read.' });
  } catch (err) {
    next(err);
  }
};

const markOneRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;
    const notification = await notificationsService.markOneRead(userId, notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    return res.status(200).json(notification);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotifications,
  getNotificationById,
  markAllRead,
  markOneRead,
};
