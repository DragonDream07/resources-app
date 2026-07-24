import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
  return_requested: ['returned', 'delivered'],
  returned: [],
};

const STATUS_COLORS = {
  pending: { bg: '#fff4e6', color: '#fd7e14' },
  confirmed: { bg: '#e8ecfd', color: '#4c6ef5' },
  processing: { bg: '#e8ecfd', color: '#4c6ef5' },
  shipped: { bg: '#e8ecfd', color: '#4c6ef5' },
  delivered: { bg: '#d3f9d8', color: '#37b24d' },
  cancelled: { bg: '#ffe3e3', color: '#f03e3e' },
  return_requested: { bg: '#fff4e6', color: '#fd7e14' },
  returned: { bg: '#e9ecef', color: '#495057' },
};

function StatusBadge({ status }) {
  const style = STATUS_COLORS[status] || { bg: '#e9ecef', color: '#495057' };
  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: style.bg,
        color: style.color,
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        lineHeight: '16px',
        padding: '4px 12px',
        borderRadius: '9999px',
        whiteSpace: 'nowrap',
      }}
    >
      {status ? status.replace(/_/g, ' ') : '—'}
    </span>
  );
}

function SectionCard({ title, children }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
        marginBottom: '24px',
        overflow: 'hidden',
      }}
    >
      {title && (
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e9ecef',
            backgroundColor: '#f8f9fa',
          }}
        >
          <h2
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#212529',
              margin: 0,
              lineHeight: '24px',
            }}
          >
            {title}
          </h2>
        </div>
      )}
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '12px',
        alignItems: 'baseline',
      }}
    >
      <span
        style={{
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#495057',
          minWidth: '140px',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '14px',
          color: '#212529',
          fontFamily: mono
            ? "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
            : 'inherit',
        }}
      >
        {value || '—'}
      </span>
    </div>
  );
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [advanceLoading, setAdvanceLoading] = useState(false);
  const [advanceError, setAdvanceError] = useState('');
  const [advanceSuccess, setAdvanceSuccess] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedNextStatus, setSelectedNextStatus] = useState('');

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return token
      ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json' };
  }, []);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [orderRes, timelineRes, refundsRes] = await Promise.allSettled([
        fetch(`/orders/${id}`, { headers: authHeaders() }),
        fetch(`/orders/${id}/timeline`, { headers: authHeaders() }),
        fetch(`/orders/${id}/refunds`, { headers: authHeaders() }),
      ]);

      if (orderRes.status === 'fulfilled' && orderRes.value.ok) {
        const data = await orderRes.value.json();
        setOrder(data);
        const nextOptions = STATUS_TRANSITIONS[data.status] || [];
        setSelectedNextStatus(nextOptions[0] || '');
      } else {
        setError('Failed to load order details.');
      }

      if (timelineRes.status === 'fulfilled' && timelineRes.value.ok) {
        const tData = await timelineRes.value.json();
        setTimeline(Array.isArray(tData) ? tData : tData.timeline || tData.items || []);
      }

      if (refundsRes.status === 'fulfilled' && refundsRes.value.ok) {
        const rData = await refundsRes.value.json();
        setRefunds(Array.isArray(rData) ? rData : rData.refunds || rData.items || []);
      }
    } catch {
      setError('Failed to load order details.');
    } finally {
      setLoading(false);
    }
  }, [id, authHeaders]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  async function handleAdvanceStatus() {
    if (!selectedNextStatus) return;
    setAdvanceLoading(true);
    setAdvanceError('');
    setAdvanceSuccess('');
    try {
      const res = await fetch(`/orders/${id}/advance`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ status: selectedNextStatus }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setAdvanceError(errData.detail || errData.message || 'Failed to advance order status.');
      } else {
        setAdvanceSuccess(`Order status updated to ${selectedNextStatus.replace(/_/g, ' ')}.`);
        await fetchOrder();
      }
    } catch {
      setAdvanceError('Failed to advance order status.');
    } finally {
      setAdvanceLoading(false);
    }
  }

  async function handleCancelOrder() {
    setCancelLoading(true);
    setCancelError('');
    try {
      const res = await fetch(`/orders/${id}/cancel`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setCancelError(errData.detail || errData.message || 'Failed to cancel order.');
      } else {
        setShowCancelConfirm(false);
        await fetchOrder();
      }
    } catch {
      setCancelError('Failed to cancel order.');
    } finally {
      setCancelLoading(false);
    }
  }

  const canCancel =
    order &&
    ['pending', 'confirmed', 'processing'].includes(order.status);
  const nextStatuses = order ? STATUS_TRANSITIONS[order.status] || [] : [];
  const canAdvance = nextStatuses.length > 0;

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          color: '#495057',
          fontSize: '16px',
        }}
      >
        Loading order…
      </div>
    );
  }

  if (error && !order) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          gap: '16px',
        }}
      >
        <p style={{ color: '#f03e3e', fontSize: '16px' }}>{error}</p>
        <button
          onClick={() => navigate('/admin/orders')}
          style={{
            padding: '10px 24px',
            backgroundColor: '#4c6ef5',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const items = order?.items || order?.order_items || [];
  const address = order?.shipping_address || order?.shippingAddress || order?.address || {};

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        color: '#212529',
      }}
    >
      {/* Cancel Confirm Modal */}
      {showCancelConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(33,37,41,0.48)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 8px 32px rgba(33,37,41,0.18)',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '600',
                margin: '0 0 12px',
                color: '#212529',
              }}
            >
              Cancel Order
            </h2>
            <p style={{ fontSize: '14px', color: '#495057', marginBottom: '24px' }}>
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            {cancelError && (
              <p
                style={{
                  backgroundColor: '#ffe3e3',
                  color: '#f03e3e',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  marginBottom: '16px',
                }}
              >
                {cancelError}
              </p>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  setCancelError('');
                }}
                disabled={cancelLoading}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #868e96',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  color: '#212529',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: cancelLoading ? '#e9ecef' : '#f03e3e',
                  color: cancelLoading ? '#adb5bd' : '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: cancelLoading ? 'not-allowed' : 'pointer',
                  minHeight: '44px',
                }}
              >
                {cancelLoading ? 'Cancelling…' : 'Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          <div>
            <Link
              to="/admin/orders"
              style={{
                fontSize: '14px',
                color: '#4c6ef5',
                textDecoration: 'none',
                display: 'inline-block',
                marginBottom: '8px',
              }}
            >
              ← Back to Orders
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  lineHeight: '32px',
                  letterSpacing: '-0.01em',
                  margin: 0,
                  color: '#212529',
                }}
              >
                Order
              </h1>
              <span
                style={{
                  fontFamily:
                    "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#4c6ef5',
                  letterSpacing: '0em',
                }}
              >
                #{order?.id || order?.orderId || id}
              </span>
              {order?.status && <StatusBadge status={order.status} />}
            </div>
          </div>

          {/* Action Controls */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {canCancel && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #f03e3e',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  color: '#f03e3e',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Cancel Order
              </button>
            )}
            {canAdvance && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {nextStatuses.length > 1 && (
                  <select
                    value={selectedNextStatus}
                    onChange={(e) => setSelectedNextStatus(e.target.value)}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #868e96',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#212529',
                      backgroundColor: '#ffffff',
                      minHeight: '44px',
                      cursor: 'pointer',
                    }}
                  >
                    {nextStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  onClick={handleAdvanceStatus}
                  disabled={advanceLoading || !selectedNextStatus}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor:
                      advanceLoading || !selectedNextStatus ? '#e9ecef' : '#4c6ef5',
                    color:
                      advanceLoading || !selectedNextStatus ? '#adb5bd' : '#ffffff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor:
                      advanceLoading || !selectedNextStatus ? 'not-allowed' : 'pointer',
                    minHeight: '44px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {advanceLoading
                    ? 'Updating…'
                    : nextStatuses.length === 1
                    ? `Mark as ${selectedNextStatus.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`
                    : 'Advance Status'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Advance Status Feedback */}
        {advanceSuccess && (
          <div
            style={{
              backgroundColor: '#d3f9d8',
              color: '#37b24d',
              borderRadius: '6px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            {advanceSuccess}
          </div>
        )}
        {advanceError && (
          <div
            style={{
              backgroundColor: '#ffe3e3',
              color: '#f03e3e',
              borderRadius: '6px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            {advanceError}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Left Column */}
          <div>
            {/* Order Summary */}
            <SectionCard title="Order Summary">
              <InfoRow
                label="Order ID"
                value={order?.id || order?.orderId || id}
                mono
              />
              <InfoRow
                label="Placed On"
                value={
                  order?.created_at || order?.createdAt
                    ? new Date(
                        order.created_at || order.createdAt
                      ).toLocaleString()
                    : undefined
                }
              />
              <InfoRow
                label="Status"
                value={<StatusBadge status={order?.status} />}
              />
              <InfoRow
                label="Payment Method"
                value={
                  order?.payment_method ||
                  order?.paymentMethod ||
                  order?.payment?.method ||
                  undefined
                }
              />
              <InfoRow
                label="Payment Status"
                value={
                  order?.payment_status ||
                  order?.paymentStatus ||
                  order?.payment?.status ||
                  undefined
                }
              />
            </SectionCard>

            {/* Customer Info */}
            <SectionCard title="Customer">
              <InfoRow
                label="Name"
                value={
                  order?.customer_name ||
                  order?.customerName ||
                  order?.customer?.name ||
                  undefined
                }
              />
              <InfoRow
                label="Email"
                value={
                  order?.customer_email ||
                  order?.customerEmail ||
                  order?.customer?.email ||
                  undefined
                }
              />
              <InfoRow
                label="Phone"
                value={
                  order?.customer_phone ||
                  order?.customerPhone ||
                  order?.customer?.phone ||
                  undefined
                }
              />
            </SectionCard>

            {/* Shipping Address */}
            <SectionCard title="Shipping Address">
              {Object.keys(address).length === 0 ? (
                <p style={{ color: '#495057', fontSize: '14px', margin: 0 }}>No address on record.</p>
              ) : (
                <>
                  <InfoRow label="Name" value={address.name || address.full_name} />
                  <InfoRow label="Line 1" value={address.line1 || address.address_line1} />
                  {(address.line2 || address.address_line2) && (
                    <InfoRow label="Line 2" value={address.line2 || address.address_line2} />
                  )}
                  <InfoRow label="City" value={address.city} />
                  <InfoRow label="State" value={address.state} />
                  <InfoRow label="Pincode" value={address.pincode || address.zip} mono />
                  <InfoRow label="Country" value={address.country} />
                  <InfoRow label="Phone" value={address.phone} />
                </>
              )}
            </SectionCard>
          </div>

          {/* Right Column */}
          <div>
            {/* Order Items */}
            <SectionCard title={`Items (${items.length})`}>
              {items.length === 0 ? (
                <p style={{ color: '#495057', fontSize: '14px', margin: 0 }}>No items.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {items.map((item, idx) => (
                    <div
                      key={item.id || item.itemId || idx}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        paddingBottom: '16px',
                        borderBottom:
                          idx < items.length - 1 ? '1px solid #e9ecef' : 'none',
                        alignItems: 'flex-start',
                      }}
                    >
                      <img
                        src={
                          item.image ||
                          item.thumbnail ||
                          item.product?.image ||
                          '/src/assets/images/placeholder-product.svg'
                        }
                        alt={item.name || item.product_name || item.product?.name || ''}
                        style={{
                          width: '56px',
                          height: '56px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid #e9ecef',
                          flexShrink: 0,
                        }}
                        onError={(e) => {
                          e.target.src = '/src/assets/images/placeholder-product.svg';
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            margin: '0 0 4px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#212529',
                          }}
                        >
                          {item.name ||
                            item.product_name ||
                            item.product?.name ||
                            'Product'}
                        </p>
                        {(item.sku || item.sku_code || item.skuCode) && (
                          <p
                            style={{
                              margin: '0 0 4px',
                              fontSize: '12px',
                              color: '#495057',
                              fontFamily:
                                "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                            }}
                          >
                            SKU: {item.sku || item.sku_code || item.skuCode}
                          </p>
                        )}
                        {item.variant && (
                          <p
                            style={{
                              margin: '0 0 4px',
                              fontSize: '12px',
                              color: '#495057',
                            }}
                          >
                            {item.variant}
                          </p>
                        )}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '8px',
                          }}
                        >
                          <span style={{ fontSize: '13px', color: '#495057' }}>
                            Qty: {item.quantity || item.qty || 1}
                          </span>
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#212529',
                            }}
                          >
                            ₹
                            {(
                              (item.price || item.unit_price || item.unitPrice || 0) *
                              (item.quantity || item.qty || 1)
                            ).toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Order Totals */}
              <div
                style={{
                  borderTop: '2px solid #e9ecef',
                  marginTop: '16px',
                  paddingTop: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {(order?.subtotal || order?.sub_total) !== undefined && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#495057' }}>
                    <span>Subtotal</span>
                    <span>
                      ₹{(order.subtotal || order.sub_total).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                {(order?.discount || order?.discount_amount) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#37b24d' }}>
                    <span>Discount</span>
                    <span>-₹{(order.discount || order.discount_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                {(order?.delivery_charge || order?.shipping_charge || order?.shippingCharge) !== undefined && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#495057' }}>
                    <span>Shipping</span>
                    <span>
                      ₹{(order.delivery_charge || order.shipping_charge || order.shippingCharge || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                {(order?.tax || order?.tax_amount) !== undefined && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#495057' }}>
                    <span>Tax</span>
                    <span>
                      ₹{(order.tax || order.tax_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#212529',
                    borderTop: '1px solid #e9ecef',
                    paddingTop: '8px',
                    marginTop: '4px',
                  }}
                >
                  <span>Total</span>
                  <span>
                    ₹
                    {(
                      order?.total ||
                      order?.total_amount ||
                      order?.totalAmount ||
                      0
                    ).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* Order Timeline */}
            {timeline.length > 0 && (
              <SectionCard title="Order Timeline">
                <ol style={{ listStyle: 'none', margin: 0, padding: 0, position: 'relative' }}>
                  {timeline.map((event, idx) => (
                    <li
                      key={event.id || idx}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        paddingBottom: idx < timeline.length - 1 ? '20px' : '0',
                        position: 'relative',
                      }}
                    >
                      {/* Connector Line */}
                      {idx < timeline.length - 1 && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '9px',
                            top: '20px',
                            width: '2px',
                            bottom: '0',
                            backgroundColor: '#e9ecef',
                          }}
                        />
                      )}
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '9999px',
                          backgroundColor:
                            idx === 0 ? '#4c6ef5' : '#e9ecef',
                          border: '2px solid',
                          borderColor: idx === 0 ? '#4c6ef5' : '#868e96',
                          flexShrink: 0,
                          marginTop: '2px',
                          zIndex: 1,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: '0 0 2px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#212529',
                          }}
                        >
                          {event.status
                            ? event.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                            : event.title || event.event || '—'}
                        </p>
                        {event.note && (
                          <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#495057' }}>
                            {event.note}
                          </p>
                        )}
                        <p style={{ margin: 0, fontSize: '12px', color: '#868e96' }}>
                          {event.created_at || event.createdAt || event.timestamp
                            ? new Date(
                                event.created_at || event.createdAt || event.timestamp
                              ).toLocaleString()
                            : ''}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </SectionCard>
            )}

            {/* Refunds */}
            {refunds.length > 0 && (
              <SectionCard title="Refunds">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {refunds.map((refund, idx) => (
                    <div
                      key={refund.id || idx}
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      <div>
                        <p
                          style={{
                            margin: '0 0 2px',
                            fontSize: '13px',
                            fontFamily:
                              "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                            color: '#212529',
                          }}
                        >
                          {refund.id || refund.refundId}
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#495057' }}>
                          {refund.created_at || refund.createdAt
                            ? new Date(
                                refund.created_at || refund.createdAt
                              ).toLocaleDateString()
                            : ''}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p
                          style={{
                            margin: '0 0 2px',
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#37b24d',
                          }}
                        >
                          ₹
                          {(refund.amount || 0).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#495057' }}>
                          {refund.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
