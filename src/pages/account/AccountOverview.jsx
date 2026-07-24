import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    margin: '0 0 32px 0',
    color: '#212529',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '8px',
  },
  profileRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '9999px',
    backgroundColor: '#e8ecfd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
    color: '#4c6ef5',
    flexShrink: 0,
  },
  userName: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    margin: '0',
  },
  userEmail: {
    fontSize: '14px',
    color: '#495057',
    margin: '0',
  },
  muted: {
    color: '#495057',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 0 16px 0',
  },
  tilesRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  tile: {
    flex: '1',
    minWidth: '140px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    border: '1px solid transparent',
    transition: 'border-color 0.15s',
  },
  tileLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
  },
  tileValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
  },
  tileSubtext: {
    fontSize: '14px',
    color: '#495057',
    margin: '0',
  },
  navList: {
    listStyle: 'none',
    margin: '0',
    padding: '0',
  },
  navItem: {
    borderBottom: '1px solid #868e96',
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    background: 'none',
    border: 'none',
    padding: '16px 20px',
    fontSize: '16px',
    fontWeight: '400',
    color: '#4c6ef5',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  skeletonLine: {
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
    marginBottom: '8px',
  },
};

export default function AccountOverview() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    Promise.all([
      fetch('/users/me', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/notifications', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => ({ items: [] })),
      fetch('/orders', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => ({ items: [] })),
    ]).then(([userData, notifData, ordersData]) => {
      setUser(userData);
      const items = notifData.items || notifData || [];
      setUnreadCount(Array.isArray(items) ? items.filter(n => !n.read).length : 0);
      const orders = ordersData.items || ordersData || [];
      setOrderCount(Array.isArray(orders) ? orders.length : 0);
    }).catch(() => {
      setUser(null);
    }).finally(() => setLoading(false));
  }, [navigate]);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.skeletonLine, height: '40px', width: '200px', marginBottom: '32px' }} />
          <div style={{ ...styles.card }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '9999px', backgroundColor: '#e9ecef' }} />
              <div style={{ flex: 1 }}>
                <div style={{ ...styles.skeletonLine, height: '20px', width: '160px' }} />
                <div style={{ ...styles.skeletonLine, height: '14px', width: '220px', marginBottom: 0 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>My Account</h1>

        {/* Profile summary card */}
        <div style={styles.card}>
          <div style={styles.profileRow}>
            <div style={styles.avatar}>{getInitials(user?.name || user?.full_name)}</div>
            <div>
              <p style={styles.userName}>{user?.name || user?.full_name || 'Welcome back'}</p>
              <p style={styles.userEmail}>{user?.email || ''}</p>
            </div>
          </div>
          <p style={styles.muted}>
            Save your details for faster checkout and access your full order history anytime.
          </p>
          <Link
            to="/account/profile"
            style={{ color: '#4c6ef5', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}
          >
            Edit profile →
          </Link>
        </div>

        {/* Quick stats tiles */}
        <div style={styles.tilesRow}>
          <div
            style={styles.tile}
            onClick={() => navigate('/account/orders')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate('/account/orders')}
            aria-label="View orders"
          >
            <span style={styles.tileLabel}>Orders</span>
            <span style={styles.tileValue}>{orderCount}</span>
            <p style={styles.tileSubtext}>Track your orders and view order history</p>
          </div>

          <div
            style={styles.tile}
            onClick={() => navigate('/account/addresses')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate('/account/addresses')}
            aria-label="View addresses"
          >
            <span style={styles.tileLabel}>Addresses</span>
            <p style={styles.tileSubtext}>Manage your saved addresses</p>
          </div>

          <div
            style={styles.tile}
            onClick={() => navigate('/account/notifications')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate('/account/notifications')}
            aria-label="View notifications"
          >
            <span style={styles.tileLabel}>Notifications</span>
            {unreadCount > 0 && <span style={styles.tileValue}>{unreadCount}</span>}
            <p style={styles.tileSubtext}>Unread notifications</p>
          </div>
        </div>

        {/* Quick links nav */}
        <div style={styles.card}>
          <p style={styles.sectionLabel}>Quick Links</p>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <button style={styles.navButton} onClick={() => navigate('/account/orders')}>
                <span>Order history</span>
                <span>›</span>
              </button>
            </li>
            <li style={styles.navItem}>
              <button style={styles.navButton} onClick={() => navigate('/account/profile')}>
                <span>Profile &amp; Password</span>
                <span>›</span>
              </button>
            </li>
            <li style={styles.navItem}>
              <button style={styles.navButton} onClick={() => navigate('/account/addresses')}>
                <span>Saved Addresses</span>
                <span>›</span>
              </button>
            </li>
            <li style={{ ...styles.navItem, borderBottom: 'none' }}>
              <button style={styles.navButton} onClick={() => navigate('/account/notifications')}>
                <span>Notifications</span>
                <span>›</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
