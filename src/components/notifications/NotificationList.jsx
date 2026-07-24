import React from 'react';
import NotificationItem from './NotificationItem';

const NotificationList = ({ notifications = [], onMarkRead }) => {
  if (notifications.length === 0) {
    return (
      <div
        className="notification-list notification-list--empty"
        style={{
          padding: '40px 16px',
          textAlign: 'center',
          color: '#718096',
          fontSize: '14px',
        }}
      >
        <p style={{ margin: 0 }}>You have no notifications.</p>
      </div>
    );
  }

  return (
    <ul
      className="notification-list"
      role="list"
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        maxHeight: '400px',
        overflowY: 'auto',
      }}
    >
      {notifications.map((notification) => (
        <li key={notification.id} role="listitem">
          <NotificationItem
            notification={notification}
            onMarkRead={onMarkRead}
          />
        </li>
      ))}
    </ul>
  );
};

export default NotificationList;
