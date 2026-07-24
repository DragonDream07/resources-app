import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const STATUS_COLORS = {
  pending: { bg: '#fff4e6', color: '#fd7e14' },
  approved: { bg: '#d3f9d8', color: '#37b24d' },
  rejected: { bg: '#ffe3e3', color: '#f03e3e' },
  completed: { bg: '#e8ecfd', color: '#4c6ef5' },
};

function StatusBadge({ status }) {
  const style = STATUS_COLORS[status] || { bg: '#e9ecef', color: '#495057' };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 12px',
        borderRadius: '9999px',
        backgroundColor: style.bg,
        color: style.color,
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {status}
    </span>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        padding: '10px 0',
        borderBottom: '1px solid #e9ecef',
        alignItems: 'flex-start',
      }}
    >
      <span
        style={{
          width: '160px',
          flexShrink: 0,
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#495057',
          paddingTop: '2px',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '14px',
          color: '#343a40',
          fontFamily: mono
            ? "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
            : "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          lineHeight: '20px',
          flex: 1,
        }}
      >
        {value ?? '—'}
      </span>
    </div>
  );
}

export default function AdminReturnDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [returnRequest, setReturnRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [decision, setDecision] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/return-requests/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load return request.');
        return res.json();
      })
      .then((data) => setReturnRequest(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const canReview =
    returnRequest && returnRequest.status === 'pending';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!decision) {
      setSubmitError('Please select a decision (approve or reject).');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const res = await fetch(`/return-requests/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, adminNote }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to submit review.');
      }
      const updated = await res.json();
      setReturnRequest(updated);
      setSubmitSuccess(
        decision === 'approved'
          ? 'Return request approved successfully.'
          : 'Return request rejected.'
      );
      setDecision('');
      setAdminNote('');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      color: '#212529',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px',
    },
    breadcrumb: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '24px',
      fontSize: '14px',
      color: '#495057',
    },
    breadcrumbLink: {
      color: '#4c6ef5',
      textDecoration: 'none',
      fontWeight: '500',
    },
    breadcrumbSep: {
      color: '#868e96',
    },
    headerRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '12px',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      letterSpacing: '-0.01em',
      lineHeight: '32px',
      margin: 0,
      color: '#212529',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 360px',
      gap: '24px',
      alignItems: 'flex-start',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      border: '1px solid #868e96',
      padding: '24px',
      marginBottom: '24px',
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      letterSpacing: '0em',
      lineHeight: '24px',
      color: '#212529',
      margin: '0 0 16px 0',
    },
    errorBox: {
      backgroundColor: '#ffe3e3',
      color: '#f03e3e',
      borderRadius: '6px',
      padding: '12px 16px',
      fontSize: '14px',
      marginBottom: '16px',
    },
    successBox: {
      backgroundColor: '#d3f9d8',
      color: '#37b24d',
      borderRadius: '6px',
      padding: '12px 16px',
      fontSize: '14px',
      marginBottom: '16px',
    },
    formGroup: {
      marginBottom: '16px',
    },
    formLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#495057',
      marginBottom: '6px',
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '6px',
      border: '1px solid #868e96',
      fontSize: '14px',
      color: '#212529',
      backgroundColor: '#ffffff',
      minHeight: '44px',
      boxSizing: 'border-box',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    textarea: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '6px',
      border: '1px solid #868e96',
      fontSize: '14px',
      color: '#212529',
      backgroundColor: '#ffffff',
      minHeight: '100px',
      resize: 'vertical',
      boxSizing: 'border-box',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      lineHeight: '1.5',
    },
    btnRow: {
      display: 'flex',
      gap: '12px',
    },
    btnApprove: {
      flex: 1,
      padding: '10px 20px',
      borderRadius: '10px',
      border: 'none',
      backgroundColor: '#37b24d',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    btnReject: {
      flex: 1,
      padding: '10px 20px',
      borderRadius: '10px',
      border: 'none',
      backgroundColor: '#f03e3e',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    btnSubmit: {
      width: '100%',
      padding: '12px 20px',
      borderRadius: '10px',
      border: 'none',
      backgroundColor: '#4c6ef5',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    btnDisabled: {
      backgroundColor: '#e9ecef',
      color: '#adb5bd',
      cursor: 'not-allowed',
    },
    itemRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 0',
      borderBottom: '1px solid #e9ecef',
    },
    itemImg: {
      width: '56px',
      height: '56px',
      objectFit: 'cover',
      borderRadius: '6px',
      backgroundColor: '#e9ecef',
      flexShrink: 0,
    },
    itemInfo: {
      flex: 1,
      fontSize: '14px',
      color: '#343a40',
    },
    itemName: {
      fontWeight: '500',
      marginBottom: '2px',
    },
    itemMeta: {
      fontSize: '12px',
      color: '#495057',
    },
    loadingState: {
      textAlign: 'center',
      padding: '64px 24px',
      color: '#495057',
      fontSize: '16px',
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingState}>Loading return request…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorBox}>{error}</div>
          <button
            style={{ ...styles.btnSubmit, width: 'auto', padding: '10px 24px' }}
            onClick={() => navigate('/admin/returns')}
          >
            Back to Return Requests
          </button>
        </div>
      </div>
    );
  }

  if (!returnRequest) return null;

  const {
    status,
    orderId,
    customerId,
    customerName,
    customer,
    reason,
    description,
    items,
    createdAt,
    updatedAt,
    adminNote: existingNote,
    refundAmount,
  } = returnRequest;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <nav style={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/admin" style={styles.breadcrumbLink}>Admin</Link>
          <span style={styles.breadcrumbSep}>›</span>
          <Link to="/admin/returns" style={styles.breadcrumbLink}>Return Requests</Link>
          <span style={styles.breadcrumbSep}>›</span>
          <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>{id}</span>
        </nav>

        <div style={styles.headerRow}>
          <h1 style={styles.title}>
            Return Request&nbsp;
            <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", fontSize: '20px' }}>
              #{id}
            </span>
          </h1>
          <StatusBadge status={status} />
        </div>

        <div style={styles.grid}>
          <div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Request Details</h2>
              <InfoRow label="Request ID" value={id} mono />
              <InfoRow label="Order ID" value={orderId} mono />
              <InfoRow label="Customer" value={customerName || customer?.name || customerId || '—'} />
              <InfoRow label="Reason" value={reason} />
              <InfoRow label="Description" value={description} />
              <InfoRow
                label="Submitted"
                value={createdAt ? new Date(createdAt).toLocaleString() : '—'}
              />
              <InfoRow
                label="Last Updated"
                value={updatedAt ? new Date(updatedAt).toLocaleString() : '—'}
              />
              {refundAmount !== undefined && (
                <InfoRow
                  label="Refund Amount"
                  value={`₹${Number(refundAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                />
              )}
              {existingNote && (
                <InfoRow label="Admin Note" value={existingNote} />
              )}
            </div>

            {Array.isArray(items) && items.length > 0 && (
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Return Items</h2>
                {items.map((item, idx) => (
                  <div key={item.id || idx} style={styles.itemRow}>
                    <img
                      src={item.imageUrl || '/src/assets/images/placeholder-product.svg'}
                      alt={item.name || 'Product'}
                      style={styles.itemImg}
                      onError={(e) => { e.currentTarget.src = '/src/assets/images/placeholder-product.svg'; }}
                    />
                    <div style={styles.itemInfo}>
                      <div style={styles.itemName}>{item.name || '—'}</div>
                      <div style={styles.itemMeta}>
                        {item.sku && (
                          <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>
                            SKU: {item.sku}
                          </span>
                        )}
                        {item.quantity && <span> · Qty: {item.quantity}</span>}
                        {item.price && (
                          <span>
                            {' '}· ₹{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        )}
                      </div>
                      {item.returnReason && (
                        <div style={{ fontSize: '12px', color: '#495057', marginTop: '2px' }}>
                          Reason: {item.returnReason}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Review Decision</h2>

              {!canReview && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '6px',
                    backgroundColor: '#e8ecfd',
                    color: '#4c6ef5',
                    fontSize: '14px',
                    marginBottom: '8px',
                  }}
                >
                  This request has already been reviewed (status: <strong>{status}</strong>).
                </div>
              )}

              {submitSuccess && (
                <div style={styles.successBox}>{submitSuccess}</div>
              )}

              {submitError && (
                <div style={styles.errorBox}>{submitError}</div>
              )}

              {canReview && (
                <form onSubmit={handleSubmit} noValidate>
                  <div style={styles.formGroup}>
                    <label htmlFor="decision" style={styles.formLabel}>
                      Decision <span style={{ color: '#f03e3e' }}>*</span>
                    </label>
                    <select
                      id="decision"
                      style={styles.select}
                      value={decision}
                      onChange={(e) => setDecision(e.target.value)}
                      disabled={submitting}
                      required
                    >
                      <option value="">Select decision…</option>
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="adminNote" style={styles.formLabel}>
                      Admin Note
                    </label>
                    <textarea
                      id="adminNote"
                      style={styles.textarea}
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Optional note to accompany the decision…"
                      disabled={submitting}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      ...styles.btnSubmit,
                      ...(submitting || !decision ? styles.btnDisabled : {}),
                    }}
                    disabled={submitting || !decision}
                  >
                    {submitting ? 'Submitting…' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>

            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Quick Links</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {orderId && (
                  <Link
                    to={`/admin/orders/${orderId}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#4c6ef5',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    <img src="/src/assets/icons/external-link.svg" alt="" width={16} height={16} />
                    View Order #{orderId}
                  </Link>
                )}
                <Link
                  to="/admin/returns"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#4c6ef5',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  <img src="/src/assets/icons/chevron-left.svg" alt="" width={16} height={16} />
                  Back to Return Requests
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
