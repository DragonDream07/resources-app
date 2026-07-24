import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

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
    padding: '48px 16px',
  },
  successBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '72px',
    height: '72px',
    borderRadius: '9999px',
    backgroundColor: '#d3f9d8',
    margin: '0 auto 24px',
    fontSize: '36px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: '700',
    lineHeight: '40px',
    letterSpacing: '-0.02em',
    textAlign: 'center',
    color: '#212529',
    marginBottom: '8px',
  },
  subheading: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#495057',
    textAlign: 'center',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    border: '1px solid #e9ecef',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    lineHeight: '16px',
    marginBottom: '16px',
  },
  orderIdBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#e8ecfd',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '20px',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '16px',
    fontWeight: '600',
    color: '#3b5bdb',
    lineHeight: '20px',
    wordBreak: 'break-all',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#495057',
    marginBottom: '10px',
  },
  rowBold: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: '700',
    lineHeight: '24px',
    color: '#212529',
    paddingTop: '12px',
    borderTop: '2px solid #e9ecef',
    marginTop: '4px',
  },
  addressText: {
    fontSize: '14px',
    lineHeight: '22px',
    color: '#343a40',
  },
  itemRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    paddingBottom: '12px',
    borderBottom: '1px solid #e9ecef',
    marginBottom: '12px',
  },
  itemImage: {
    width: '52px',
    height: '52px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #e9ecef',
    flexShrink: 0,
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    lineHeight: '20px',
  },
  itemMeta: {
    fontSize: '12px',
    color: '#495057',
    lineHeight: '16px',
  },
  itemPrice: {
    marginLeft: 'auto',
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    whiteSpace: 'nowrap',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    flex: 1,
    padding: '14px 24px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  secondaryBtn: {
    flex: 1,
    padding: '14px 24px',
    backgroundColor: '#ffffff',
    color: '#4c6ef5',
    border: '2px solid #4c6ef5',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  registerPrompt: {
    backgroundColor: '#fff3e6',
    border: '1px solid #fd7e14',
    borderRadius: '10px',
    padding: '20px 24px',
    marginTop: '20px',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  registerText: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    flex: 1,
  },
  registerBtn: {
    padding: '10px 20px',
    backgroundColor: '#fd7e14',
    color: '#212529',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function apiGet(path, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
}

export default function CheckoutConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('authToken');
  const isGuest = !token;

  const passedOrderId = location.state?.orderId;
  const passedOrder = location.state?.order;

  const [order, setOrder] = useState(passedOrder || null);
  const [loading, setLoading] = useState(!passedOrder && !!passedOrderId);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!passedOrder && passedOrderId) {
      setLoading(true);
      apiGet(`/orders/${passedOrderId}`, token)
        .then((data) => {
          setOrder(data);
          setLoadError('');
        })
        .catch(() => {
          setLoadError('Could not load order details.');
        })
        .finally(() => setLoading(false));
    }
  }, [passedOrderId, passedOrder, token]);

  // Clear cart from local state after order confirmation
  useEffect(() => {
    localStorage.removeItem('cartId');
  }, []);

  if (!passedOrderId && !passedOrder) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#495057' }}>
            No order information found.{' '}
            <button
              style={{ color: '#4c6ef5', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
              onClick={() => navigate('/')}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#495057', fontSize: '16px' }}>
            Loading order details…
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div
            role="alert"
            style={{
              padding: '16px',
              backgroundColor: '#ffe3e3',
              color: '#f03e3e',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            {loadError}
          </div>
        </div>
      </div>
    );
  }

  const orderId = order?.id || order?.orderId || order?.order_id || passedOrderId;
  const items = order?.items || order?.cartItems || [];
  const subtotal = order?.subtotal || order?.subTotal || 0;
  const tax = order?.tax || order?.taxAmount || 0;
  const shipping = order?.shippingCharge || order?.shipping || 0;
  const discount = order?.discount || order?.discountAmount || 0;
  const total = order?.total || order?.grandTotal || 0;
  const address = order?.address || order?.deliveryAddress || {};
  const estimatedDelivery = order?.estimatedDelivery || order?.estimated_delivery || '';

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Success icon */}
        <div style={styles.successBadge} aria-hidden="true">✓</div>

        <h1 style={styles.heading}>Order Confirmed!</h1>
        <p style={styles.subheading}>
          Thank you for your purchase. We'll send you updates as your order progresses.
        </p>

        {/* Order ID */}
        <div style={styles.orderIdBlock}>
          <img src="/src/assets/icons/package.svg" alt="" style={{ width: '20px', height: '20px' }} />
          <div>
            <div style={{ fontSize: '11px', color: '#495057', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2px' }}>Order ID</div>
            <div style={styles.orderId}>{orderId}</div>
          </div>
        </div>

        {/* Items */}
        {items.length > 0 && (
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Items Ordered</div>
            {items.map((item, idx) => (
              <div key={item.id || item.itemId || idx} style={styles.itemRow}>
                <img
                  src={item.image || item.imageUrl || '/src/assets/images/placeholder-product.svg'}
                  alt={item.name || item.productName || 'Product'}
                  style={styles.itemImage}
                  onError={(e) => { e.target.src = '/src/assets/images/placeholder-product.svg'; }}
                />
                <div>
                  <div style={styles.itemName}>{item.name || item.productName}</div>
                  <div style={styles.itemMeta}>
                    {item.variant || item.skuLabel ? `${item.variant || item.skuLabel} · ` : ''}
                    Qty: {item.quantity || item.qty || 1}
                  </div>
                </div>
                <div style={styles.itemPrice}>
                  {formatCurrency((item.price || item.unitPrice || 0) * (item.quantity || item.qty || 1))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order summary */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Order Summary</div>
          <div style={styles.row}>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div style={styles.row}>
            <span>Tax</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div style={styles.row}>
            <span>Shipping</span>
            <span>{shipping === 0 ? <span style={{ color: '#37b24d' }}>Free</span> : formatCurrency(shipping)}</span>
          </div>
          {discount > 0 && (
            <div style={{ ...styles.row, color: '#37b24d' }}>
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div style={styles.rowBold}>
            <span>Total Paid</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Delivery address */}
        {(address.line1 || address.fullName) && (
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Delivery To</div>
            <div style={styles.addressText}>
              <strong>{address.fullName || address.full_name}</strong><br />
              {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
              {address.city}, {address.state} – {address.pincode || address.zip}<br />
              {address.phone}
            </div>
            {estimatedDelivery && (
              <div style={{ marginTop: '12px', fontSize: '13px', color: '#37b24d', fontWeight: '500' }}>
                Estimated Delivery: {estimatedDelivery}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={styles.actions}>
          <Link to={`/orders/${orderId}`} style={styles.primaryBtn}>
            Track Order
          </Link>
          <Link to="/" style={styles.secondaryBtn}>
            Continue Shopping
          </Link>
        </div>

        {/* Guest register prompt */}
        {isGuest && (
          <div style={styles.registerPrompt}>
            <div style={styles.registerText}>
              <strong>Save your order history.</strong> Create a free account to track orders, get exclusive offers, and speed up future checkouts.
            </div>
            <Link to="/checkout/register" state={{ orderId }} style={styles.registerBtn}>
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
