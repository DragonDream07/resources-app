import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const STATUS_BADGE = {
  pending: { bg: '#fff4e6', color: '#fd7e14', label: 'Pending' },
  confirmed: { bg: '#e8ecfd', color: '#4c6ef5', label: 'Confirmed' },
  processing: { bg: '#e8ecfd', color: '#4c6ef5', label: 'Processing' },
  shipped: { bg: '#e8ecfd', color: '#4c6ef5', label: 'Shipped' },
  delivered: { bg: '#d3f9d8', color: '#37b24d', label: 'Delivered' },
  cancelled: { bg: '#ffe3e3', color: '#f03e3e', label: 'Cancelled' },
  return_requested: { bg: '#fff3e6', color: '#fd7e14', label: '↩ Return requested' },
  returned: { bg: '#ffe3e3', color: '#f03e3e', label: 'Returned' },
};

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
    margin: '0 0 8px 0',
    color: '#212529',
  },
  breadcrumb: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '24px',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    fontWeight: '400',
    color: '#212529',
    margin: '0 0 4px 0',
  },
  orderDate: {
    fontSize: '14px',
    color: '#495057',
    margin: '0',
  },
  orderTotal: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
  },
  badge: (status) => {
    const s = STATUS_BADGE[status] || { bg: '#e9ecef', color: '#495057', label: status };
    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.04em',
      backgroundColor: s.bg,
      color: s.color,
      whiteSpace: 'nowrap',
    };
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
  notifLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontSize: '14px',
  },
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    fetch('/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) throw new Error('Failed to load orders');
        return r.json();
      })
      .then(data => setOrders(Array.isArray(data) ? data : (data.items || [])))
      .catch(() => setError('Failed to load your orders. Please try again.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const getStatusLabel = (status) => {
    const s = STATUS_BADGE[status];
    return s ? s.label : status;
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <Link to="/account" style={{ color: '#4c6ef5', textDecoration: 'none' }}>My Account</Link>
          {' › '}
          <span>Order history</span>
        </div>
        <div style={styles.headerRow}>
          <h1 style={{ ...styles.pageTitle, margin: 0 }}>Order history</h1>
          <Link to="/account/notifications" style={styles.notifLink}>Notifications</Link>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <span>⚠</span>
            <span>{error}</span>
            <button
              onClick={() => window.location.reload()}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f03e3e', cursor: 'pointer', fontWeight: '600' }}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ ...styles.card, cursor: 'default' }}>
                <div>
                  <div style={{ height: '14px', width: '160px', backgroundColor: '#e9ecef', borderRadius: '6px', marginBottom: '8px' }} />
                  <div style={{ height: '14px', width: '100px', backgroundColor: '#e9ecef', borderRadius: '6px' }} />
                </div>
                <div style={{ height: '24px', width: '80px', backgroundColor: '#e9ecef', borderRadius: '9999px' }} />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={styles.emptyState}>
            <img src="/src/assets/images/empty-state.svg" alt="" style={{ width: '80px', marginBottom: '16px', opacity: 0.5 }} />
            <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>No orders yet</p>
            <p style={{ fontSize: '14px', color: '#495057', margin: '0 0 20px 0' }}>Your order history will appear here once you place an order.</p>
            <Link to="/" style={{ color: '#4c6ef5', textDecoration: 'none', fontWeight: '600' }}>Browse products</Link>
          </div>
        ) : (
          <div>
            {orders.map(order => (
              <Link
                key={order.id}
                to={`/account/orders/${order.id}`}
                style={styles.card}
              >
                <div>
                  <p style={styles.orderId}>#{order.id || order.order_number}</p>
                  <p style={styles.orderDate}>
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                    {order.items_count != null ? ` · ${order.items_count} item${order.items_count !== 1 ? 's' : ''}` : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {order.total != null && (
                    <span style={styles.orderTotal}>
                      {typeof order.total === 'number' ? `$${order.total.toFixed(2)}` : order.total}
                    </span>
                  )}
                  <span style={styles.badge(order.status)}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
