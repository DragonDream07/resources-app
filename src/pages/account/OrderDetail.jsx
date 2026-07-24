import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

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
    margin: '0 0 4px 0',
    color: '#212529',
  },
  breadcrumb: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '20px',
  },
  sectionHeading: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    margin: '0 0 16px 0',
    color: '#212529',
  },
  badge: (status) => {
    const s = STATUS_BADGE[status] || { bg: '#e9ecef', color: '#495057', label: status };
    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.04em',
      backgroundColor: s.bg,
      color: s.color,
    };
  },
  timeline: {
    listStyle: 'none',
    margin: '0',
    padding: '0',
  },
  timelineItem: (active) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
    opacity: active ? 1 : 0.4,
  }),
  timelineDot: (active) => ({
    width: '12px',
    height: '12px',
    borderRadius: '9999px',
    backgroundColor: active ? '#4c6ef5' : '#868e96',
    flexShrink: 0,
    marginTop: '4px',
  }),
  orderIdCode: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    color: '#495057',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 0',
    borderBottom: '1px solid #e9ecef',
  },
  itemImg: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
    flexShrink: 0,
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    padding: '12px 20px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    textDecoration: 'none',
  },
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    padding: '12px 20px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #868e96',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  btnDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    padding: '12px 20px',
    backgroundColor: 'transparent',
    color: '#f03e3e',
    border: '1px solid #f03e3e',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  errorPanel: {
    textAlign: 'center',
    padding: '48px 24px',
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
  },
};

const TIMELINE_STEPS = [
  { key: 'placed', label: 'Order placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

const STATUS_ORDER = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelError, setCancelError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    Promise.all([
      fetch(`/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`/orders/${id}/timeline`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
      fetch(`/orders/${id}/tracking`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
    ]).then(async ([orderRes, timelineRes, trackingRes]) => {
      if (!orderRes.ok) throw new Error('order_not_found');
      const orderData = await orderRes.json();
      setOrder(orderData);
      if (timelineRes && timelineRes.ok) {
        const tl = await timelineRes.json();
        setTimeline(Array.isArray(tl) ? tl : (tl.items || []));
      }
      if (trackingRes && trackingRes.ok) {
        setTracking(await trackingRes.json());
      }
    }).catch(() => setError('Order not found or you do not have permission to view it.'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelError(null);
    setCancelling(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`/orders/${id}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setOrder(prev => ({ ...prev, status: 'cancelled' }));
    } catch {
      setCancelError('Failed to cancel order. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ height: '14px', width: '240px', backgroundColor: '#e9ecef', borderRadius: '6px', marginBottom: '24px' }} />
          <div style={{ height: '40px', width: '300px', backgroundColor: '#e9ecef', borderRadius: '6px', marginBottom: '24px' }} />
          <div style={{ height: '200px', backgroundColor: '#ffffff', borderRadius: '10px', marginBottom: '20px' }} />
          <div style={{ height: '160px', backgroundColor: '#ffffff', borderRadius: '10px' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorPanel}>
            <p style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0' }}>⚠ Order not found</p>
            <p style={{ fontSize: '14px', color: '#495057', margin: '0 0 20px 0' }}>{error}</p>
            <Link to="/account/orders" style={{ color: '#4c6ef5', fontSize: '14px', textDecoration: 'none', fontWeight: '600' }}>
              ← Back to order history
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStatusIdx = STATUS_ORDER.indexOf(order?.status);
  const canCancel = ['pending', 'confirmed'].includes(order?.status);
  const canReturn = order?.status === 'delivered';

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <Link to="/account" style={{ color: '#4c6ef5', textDecoration: 'none' }}>My Account</Link>
          {' › '}
          <Link to="/account/orders" style={{ color: '#4c6ef5', textDecoration: 'none' }}>Order history</Link>
          {' › '}
          <span>Order #{id}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <h1 style={{ ...styles.pageTitle, margin: 0 }}>Order detail</h1>
          <span style={styles.badge(order?.status)}>
            {STATUS_BADGE[order?.status]?.label || order?.status}
          </span>
        </div>

        {cancelError && <div style={styles.errorBanner}>{cancelError}</div>}

        {/* Order meta */}
        <div style={styles.card}>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#495057', margin: '0 0 4px 0' }}>Order ID</p>
              <p style={{ ...styles.orderIdCode, margin: 0 }}>#{order?.id}</p>
            </div>
            {order?.created_at && (
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#495057', margin: '0 0 4px 0' }}>Placed on</p>
                <p style={{ fontSize: '14px', margin: 0 }}>{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            )}
            {order?.total != null && (
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#495057', margin: '0 0 4px 0' }}>Total</p>
                <p style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>
                  {typeof order.total === 'number' ? `$${order.total.toFixed(2)}` : order.total}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        {(timeline.length > 0 || order?.status) && (
          <div style={styles.card}>
            <h2 style={styles.sectionHeading}>Order status timeline</h2>
            {timeline.length > 0 ? (
              <ul style={styles.timeline}>
                {timeline.map((step, i) => (
                  <li key={i} style={styles.timelineItem(true)}>
                    <div style={styles.timelineDot(true)} />
                    <div>
                      <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '600' }}>{step.status || step.label}</p>
                      {step.timestamp && <p style={{ margin: 0, fontSize: '12px', color: '#495057' }}>{new Date(step.timestamp).toLocaleString()}</p>}
                      {step.note && <p style={{ margin: 0, fontSize: '12px', color: '#495057' }}>{step.note}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul style={styles.timeline}>
                {TIMELINE_STEPS.map((step, i) => {
                  const active = i <= currentStatusIdx || order?.status === step.key;
                  return (
                    <li key={step.key} style={styles.timelineItem(active)}>
                      <div style={styles.timelineDot(active)} />
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: active ? '600' : '400' }}>{step.label}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* Tracking */}
        {tracking && (
          <div style={styles.card}>
            <h2 style={styles.sectionHeading}>Tracking</h2>
            <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}>
              <strong>Carrier:</strong> {tracking.carrier}
            </p>
            <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontFamily: "'JetBrains Mono', monospace" }}>
              <strong>Tracking number:</strong> {tracking.tracking_number}
            </p>
            {tracking.estimated_delivery && (
              <p style={{ margin: 0, fontSize: '14px' }}>
                <strong>Estimated delivery:</strong> {new Date(tracking.estimated_delivery).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Items */}
        {order?.items && order.items.length > 0 && (
          <div style={styles.card}>
            <h2 style={styles.sectionHeading}>Items</h2>
            {order.items.map((item, i) => (
              <div key={item.id || i} style={{ ...styles.itemRow, borderBottom: i < order.items.length - 1 ? '1px solid #e9ecef' : 'none' }}>
                <img
                  src={item.image_url || '/src/assets/images/placeholder-product.svg'}
                  alt={item.name}
                  style={styles.itemImg}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>{item.name}</p>
                  {item.sku && <p style={{ margin: 0, fontSize: '12px', color: '#495057', fontFamily: "'JetBrains Mono', monospace" }}>SKU: {item.sku}</p>}
                  <p style={{ margin: 0, fontSize: '12px', color: '#495057' }}>Qty: {item.quantity}</p>
                </div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
                  {typeof item.price === 'number' ? `$${(item.price * item.quantity).toFixed(2)}` : ''}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {canReturn && (
            <Link to={`/account/orders/${id}/return`} style={styles.btnPrimary}>
              Request return
            </Link>
          )}
          {canCancel && (
            <button style={styles.btnDanger} onClick={handleCancel} disabled={cancelling}>
              {cancelling ? 'Cancelling…' : 'Cancel order'}
            </button>
          )}
          <Link to="/account/orders" style={styles.btnGhost}>
            ← Back to order history
          </Link>
        </div>
      </div>
    </div>
  );
}
