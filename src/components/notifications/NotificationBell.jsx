import React, { useState, useRef, useEffect } from 'react';
import bellIcon from '@/assets/icons/bell.svg';
import NotificationList from './NotificationList';

const NotificationBell = ({ notifications = [], onMarkRead, onMarkAllRead }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="notification-bell" ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="notification-bell__button"
        onClick={handleToggle}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={bellIcon}
          alt=""
          width={24}
          height={24}
          className="notification-bell__icon"
        />
        {unreadCount > 0 && (
          <span
            className="notification-bell__badge"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              background: '#e53e3e',
              color: '#fff',
              borderRadius: '50%',
              minWidth: '18px',
              height: '18px',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              lineHeight: 1,
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="notification-bell__dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '360px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            zIndex: 1000,
            overflow: 'hidden',
          }}
          role="dialog"
          aria-label="Notifications panel"
        >
          <div
            className="notification-bell__dropdown-header"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <span style={{ fontWeight: 600, fontSize: '15px', color: '#1a202c' }}>Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={() => {
                  if (onMarkAllRead) onMarkAllRead();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#3182ce',
                  fontWeight: 500,
                  padding: 0,
                }}
              >
                Mark all as read
              </button>
            )}
          </div>
          <NotificationList
            notifications={notifications}
            onMarkRead={onMarkRead}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
