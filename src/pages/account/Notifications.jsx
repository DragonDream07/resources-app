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
    maxWidth: '720px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    margin: '0',
    color: '#212529',
  },
  breadcrumb: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '24px',
  },
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #868e96',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  notifCard: (read) => ({
    backgroundColor: read ? '#ffffff' : '#e8ecfd',
    borderRadius: '10px',
    padding: '16px 20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    marginBottom: '10px',
    cursor: 'pointer',
    borderLeft: read ? '3px solid transparent' : '3px solid #4c6ef5',
    transition: 'background 0.15s',
  }),
  notifTitle: {
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    color: '#212529',
  },
  notifBody: {
    fontSize: '16px',
    color: '#212529',
    lineHeight: '1.625',
    margin: '0 0 6px 0',
  },
  notifTime: {
    fontSize: '12px',
    color: '#495057',
    margin: 0,
  },
  unreadDot: {
    width: '8px',
    height: '8px',
    borderRadius: '9999px',
    backgroundColor: '#4c6ef5',
    flexShrink: 0,
    marginTop: '6px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  successToast: {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
    borderRadius: '6px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    zIndex: 9999,
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  },
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadNotifications = () => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    setError(null);
    setLoading(true);
    fetch('/notifications', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(data => setNotifications(Array.isArray(data) ? data : (data.items || [])))
      .catch(() => setError('Unable to load notifications. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadNotifications(); }, []);

  const handleMarkAll = async () => {
    setMarkingAll(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch('/notifications/read-all', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      showToast('All notifications marked as read');
    } catch {
      showToast('Failed to mark notifications as read.');
    } finally {
      setMarkingAll(false);
    }
  };

  const handleMarkOne = async (notifId) => {
    const token = localStorage.getItem('access_token');
    try {
      await fetch(`/notifications/${notifId}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev =>
        prev.map(n => n.id === notifId ? { ...n, read: true } : n)
      );
    } catch {
      // silent
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <Link to="/account" style={{ color: '#4c6ef5', textDecoration: 'none' }}>My Account</Link>
          {' › '}
          <span>Notifications</span>
        </div>

        <div style={styles.headerRow}>
          <h1 style={styles.pageTitle}>Notifications</h1>
          {notifications.some(n => !n.read) && (
            <button style={styles.btnGhost} onClick={handleMarkAll} disabled={markingAll}>
              {markingAll ? 'Marking…' : 'Mark all as read'}
            </button>
          )}
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <span>⚠</span>
            <span>{error}</span>
            <button
              onClick={loadNotifications}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f03e3e', cursor: 'pointer', fontWeight: '600' }}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '16px 20px', marginBottom: '10px' }}>
                <div style={{ height: '14px', width: '200px', backgroundColor: '#e9ecef', borderRadius: '6px', marginBottom: '8px' }} />
                <div style={{ height: '16px', width: '100%', backgroundColor: '#e9ecef', borderRadius: '6px', marginBottom: '4px' }} />
                <div style={{ height: '16px', width: '70%', backgroundColor: '#e9ecef', borderRadius: '6px' }} />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div style={styles.emptyState}>
            <img src="/src/assets/images/empty-state.svg" alt="" style={{ width: '80px', marginBottom: '16px', opacity: 0.5 }} />
            <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>You're all caught up — no notifications yet</p>
            <Link to="/" style={{ color: '#4c6ef5', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>Browse products</Link>
          </div>
        ) : (
          <div>
            {notifications.map(notif => (
              <div
                key={notif.id}
                style={styles.notifCard(notif.read)}
                onClick={() => !notif.read && handleMarkOne(notif.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && !notif.read && handleMarkOne(notif.id)}
                aria-label={notif.read ? 'Notification (read)' : 'Mark notification as read'}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  {!notif.read && <div style={styles.unreadDot} />}
                  <div style={{ flex: 1 }}>
                    {notif.title && <p style={styles.notifTitle}>{notif.title}</p>}
                    <p style={styles.notifBody}>{notif.message || notif.body}</p>
                    {notif.created_at && (
                      <p style={styles.notifTime}>
                        {new Date(notif.created_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && <div style={styles.successToast}>{toast}</div>}
    </div>
  );
}
