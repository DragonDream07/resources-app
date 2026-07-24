import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  sectionHeading: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    margin: '0 0 16px 0',
  },
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '6px',
  },
  select: {
    display: 'block',
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    appearance: 'auto',
  },
  textarea: {
    display: 'block',
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '120px',
    resize: 'vertical',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '12px',
    cursor: 'pointer',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    padding: '12px 24px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #868e96',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  successPanel: {
    textAlign: 'center',
    padding: '48px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #e9ecef',
  },
  itemImg: {
    width: '48px',
    height: '48px',
    objectFit: 'cover',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
    flexShrink: 0,
  },
};

const RETURN_REASONS = [
  'Item arrived damaged',
  'Item does not match description',
  'Wrong item received',
  'Size / fit issue',
  'Changed my mind',
  'Other',
];

export default function ReturnRequest() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [reason, setReason] = useState(RETURN_REASONS[0]);
  const [notes, setNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    fetch(`/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(data => {
        setOrder(data);
        const initial = {};
        if (data.items) {
          data.items.forEach(item => { initial[item.id] = false; });
        }
        setSelectedItems(initial);
      })
      .catch(() => setError('Failed to load order details.'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const toggleItem = (itemId) => {
    setSelectedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    const eligible = Object.entries(selectedItems).filter(([, v]) => v).map(([k]) => k);
    if (eligible.length === 0) {
      setSubmitError('Please select at least one item to return.');
      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`/orders/${id}/return-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason, notes, item_ids: eligible }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.detail || 'Failed to submit return request.');
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ height: '200px', backgroundColor: '#ffffff', borderRadius: '10px' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.successPanel}>
            <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>⚠ {error}</p>
            <Link to={`/account/orders/${id}`} style={{ color: '#4c6ef5', textDecoration: 'none' }}>← Back to order</Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.successPanel}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0' }}>Return request submitted</h2>
            <p style={{ fontSize: '14px', color: '#495057', margin: '0 0 24px 0' }}>
              Our team will review your request within 1–2 business days.
            </p>
            <Link to={`/account/orders/${id}`} style={{ color: '#4c6ef5', textDecoration: 'none', fontWeight: '600' }}>
              ← Back to order detail
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <Link to="/account" style={{ color: '#4c6ef5', textDecoration: 'none' }}>My Account</Link>
          {' › '}
          <Link to="/account/orders" style={{ color: '#4c6ef5', textDecoration: 'none' }}>Order history</Link>
          {' › '}
          <Link to={`/account/orders/${id}`} style={{ color: '#4c6ef5', textDecoration: 'none' }}>Order #{id}</Link>
          {' › '}
          <span>Return request</span>
        </div>

        <h1 style={styles.pageTitle}>Return request</h1>
        <p style={{ fontSize: '14px', color: '#495057', margin: '0 0 24px 0' }}>
          Select the items you wish to return and provide a reason.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Item selection */}
          {order?.items && order.items.length > 0 && (
            <div style={styles.card}>
              <h2 style={styles.sectionHeading}>Select items to return</h2>
              {order.items.map((item, i) => (
                <div
                  key={item.id}
                  style={{ ...styles.itemRow, borderBottom: i < order.items.length - 1 ? '1px solid #e9ecef' : 'none' }}
                >
                  <input
                    type="checkbox"
                    id={`item-${item.id}`}
                    checked={!!selectedItems[item.id]}
                    onChange={() => toggleItem(item.id)}
                    style={{ width: '18px', height: '18px', flexShrink: 0 }}
                  />
                  <label htmlFor={`item-${item.id}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}>
                    <img
                      src={item.image_url || '/src/assets/images/placeholder-product.svg'}
                      alt={item.name}
                      style={styles.itemImg}
                    />
                    <div>
                      <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '600' }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#495057' }}>Qty: {item.quantity}</p>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Reason */}
          <div style={styles.card}>
            <h2 style={styles.sectionHeading}>Return reason</h2>
            {submitError && <div style={styles.errorBanner}>{submitError}</div>}
            <div style={styles.fieldGroup}>
              <label htmlFor="return-reason" style={styles.label}>Reason</label>
              <select
                id="return-reason"
                style={styles.select}
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
              >
                {RETURN_REASONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div style={styles.fieldGroup}>
              <label htmlFor="return-notes" style={styles.label}>Additional notes <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <textarea
                id="return-notes"
                style={styles.textarea}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Please describe the issue in more detail…"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button type="button" style={styles.btnGhost} onClick={() => navigate(`/account/orders/${id}`)}>
                Cancel
              </button>
              <button type="submit" style={styles.btnPrimary} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit return request'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
