import React from 'react';
import bellIcon from '@/assets/icons/bell.svg';
import checkIcon from '@/assets/icons/check.svg';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const NotificationItem = ({ notification, onMarkRead }) => {
  const { id, message, timestamp, read, icon } = notification;

  const handleMarkRead = () => {
    if (!read && onMarkRead) {
      onMarkRead(id);
    }
  };

  return (
    <div
      className={`notification-item${read ? ' notification-item--read' : ' notification-item--unread'}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 16px',
        background: read ? '#fff' : '#ebf8ff',
        borderBottom: '1px solid #e2e8f0',
        transition: 'background 0.2s',
      }}
    >
      <div
        className="notification-item__icon"
        style={{
          flexShrink: 0,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#bee3f8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={icon || bellIcon}
          alt=""
          width={18}
          height={18}
          style={{ display: 'block' }}
        />
      </div>

      <div
        className="notification-item__body"
        style={{ flex: 1, minWidth: 0 }}
      >
        <p
          className="notification-item__message"
          style={{
            margin: '0 0 4px 0',
            fontSize: '14px',
            color: '#1a202c',
            fontWeight: read ? 400 : 600,
            lineHeight: '1.4',
            wordBreak: 'break-word',
          }}
        >
          {message}
        </p>
        <span
          className="notification-item__timestamp"
          style={{
            fontSize: '12px',
            color: '#718096',
          }}
        >
          {formatTimestamp(timestamp)}
        </span>
      </div>

      {!read && (
        <button
          className="notification-item__mark-read"
          onClick={handleMarkRead}
          title="Mark as read"
          aria-label="Mark notification as read"
          style={{
            flexShrink: 0,
            background: 'none',
            border: '1px solid #90cdf4',
            borderRadius: '4px',
            cursor: 'pointer',
            padding: '4px 6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3182ce',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#bee3f8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
          }}
        >
          <img src={checkIcon} alt="" width={14} height={14} />
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
