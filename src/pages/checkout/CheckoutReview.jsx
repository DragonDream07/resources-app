import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px',
    fontSize: '14px',
  },
  stepActive: {
    color: '#4c6ef5',
    fontWeight: '600',
  },
  stepDone: {
    color: '#37b24d',
    fontWeight: '600',
  },
  stepInactive: {
    color: '#adb5bd',
  },
  stepDivider: {
    color: '#adb5bd',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    marginBottom: '24px',
    color: '#212529',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '32px',
    alignItems: 'start',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    border: '1px solid #e9ecef',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    marginBottom: '16px',
    color: '#212529',
  },
  itemRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    paddingBottom: '16px',
    borderBottom: '1px solid #e9ecef',
    marginBottom: '16px',
  },
  itemImage: {
    width: '64px',
    height: '64px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #e9ecef',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    lineHeight: '20px',
    marginBottom: '4px',
  },
  itemMeta: {
    fontSize: '12px',
    color: '#495057',
    lineHeight: '16px',
  },
  itemPrice: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    whiteSpace: 'nowrap',
  },
  totalsTable: {
    width: '100%',
  },
  totalsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#495057',
    marginBottom: '10px',
  },
  totalsRowBold: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: '700',
    lineHeight: '24px',
    color: '#212529',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '2px solid #e9ecef',
  },
  totalsRowDiscount: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#37b24d',
    marginBottom: '10px',
  },
  freeShipping: {
    color: '#37b24d',
    fontWeight: '500',
  },
  promoRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    alignItems: 'flex-start',
  },
  promoInput: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#212529',
    outline: 'none',
    minHeight: '44px',
    boxSizing: 'border-box',
  },
  promoBtn: {
    padding: '10px 16px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    whiteSpace: 'nowrap',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  promoBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  promoError: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '4px',
  },
  promoSuccess: {
    fontSize: '12px',
    color: '#37b24d',
    marginTop: '4px',
  },
  promoApplied: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '16px',
  },
  removePromo: {
    background: 'none',
    border: 'none',
    color: '#f03e3e',
    cursor: 'pointer',
    fontSize: '13px',
    padding: 0,
    marginLeft: 'auto',
  },
  addressBlock: {
    fontSize: '14px',
    lineHeight: '22px',
    color: '#343a40',
  },
  submitBtn: {
    width: '100%',
    padding: '14px 24px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    marginTop: '8px',
  },
  submitBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '16px',
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  loading: {
    textAlign: 'center',
    padding: '48px 0',
    color: '#495057',
    fontSize: '16px',
  },
  error: {
    padding: '16px',
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    fontSize: '14px',
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

async function apiPost(path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(`POST ${path} failed: ${res.status}`), { data: err });
  }
  return res.json();
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
}

export default function CheckoutReview() {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  const cartId = localStorage.getItem('cartId');

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState('');

  useEffect(() => {
    setLoading(true);
    apiGet('/checkout/review', token)
      .then((data) => {
        setReview(data);
        setLoadError('');
      })
      .catch((err) => {
        setLoadError('Failed to load order review. Please go back and try again.');
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function handleApplyPromo() {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const data = await apiPost(`/carts/${cartId}/promo`, { code: promoCode.trim().toUpperCase() }, token);
      setPromoApplied({ code: promoCode.trim().toUpperCase(), discount: data.discount || data.discountAmount || 0 });
      setPromoCode('');
      // Refresh review
      const updated = await apiGet('/checkout/review', token);
      setReview(updated);
    } catch (err) {
      setPromoError(err?.data?.detail || err?.data?.message || 'Invalid or expired promo code.');
    } finally {
      setPromoLoading(false);
    }
  }

  async function handleRemovePromo() {
    setPromoApplied(null);
    setPromoError('');
    // Optionally refresh review without promo
    try {
      const updated = await apiGet('/checkout/review', token);
      setReview(updated);
    } catch {
      // ignore
    }
  }

  async function handlePlaceOrder() {
    setPlacing(true);
    setPlaceError('');
    try {
      const data = await apiPost('/checkout/place-order', {}, token);
      const orderId = data.orderId || data.order_id || data.id;
      navigate('/checkout/confirmation', { state: { orderId, order: data } });
    } catch (err) {
      setPlaceError(err?.data?.detail || err?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>Loading order review…</div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.error} role="alert">{loadError}</div>
          <button style={styles.backLink} onClick={() => navigate('/checkout/payment')} type="button">
            ← Back to Payment
          </button>
        </div>
      </div>
    );
  }

  const items = review?.items || review?.cartItems || [];
  const subtotal = review?.subtotal || review?.subTotal || 0;
  const tax = review?.tax || review?.taxAmount || 0;
  const shipping = review?.shippingCharge || review?.shipping || 0;
  const discount = review?.discount || review?.discountAmount || (promoApplied ? promoApplied.discount : 0);
  const total = review?.total || review?.grandTotal || (subtotal + tax + shipping - discount);
  const address = review?.address || review?.deliveryAddress || {};
  const paymentMethod = review?.paymentMethod || review?.payment?.method || 'Card';

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <nav style={styles.stepIndicator} aria-label="Checkout steps">
          <span style={styles.stepDone}>✓ 1. Address</span>
          <span style={styles.stepDivider}>›</span>
          <span style={styles.stepDone}>✓ 2. Payment</span>
          <span style={styles.stepDivider}>›</span>
          <span style={styles.stepActive}>3. Review</span>
        </nav>

        <button style={styles.backLink} onClick={() => navigate('/checkout/payment')} type="button">
          ← Back to Payment
        </button>

        <h1 style={styles.heading}>Review Your Order</h1>

        <div style={styles.layout}>
          <div>
            {/* Items */}
            <div style={styles.card}>
              <div style={styles.sectionTitle}>Items ({items.length})</div>
              {items.map((item, idx) => (
                <div key={item.id || item.itemId || idx} style={styles.itemRow}>
                  <img
                    src={item.image || item.imageUrl || '/src/assets/images/placeholder-product.svg'}
                    alt={item.name || item.productName || 'Product'}
                    style={styles.itemImage}
                    onError={(e) => { e.target.src = '/src/assets/images/placeholder-product.svg'; }}
                  />
                  <div style={styles.itemInfo}>
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

            {/* Delivery address */}
            <div style={styles.card}>
              <div style={styles.sectionTitle}>Delivery Address</div>
              <div style={styles.addressBlock}>
                <strong>{address.fullName || address.full_name}</strong><br />
                {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
                {address.city}, {address.state} – {address.pincode || address.zip}<br />
                {address.phone}
              </div>
            </div>

            {/* Payment method */}
            <div style={styles.card}>
              <div style={styles.sectionTitle}>Payment Method</div>
              <div style={{ fontSize: '14px', color: '#343a40', lineHeight: '20px' }}>
                {paymentMethod}
              </div>
            </div>
          </div>

          {/* Order summary sidebar */}
          <aside>
            <div style={styles.card}>
              <div style={styles.sectionTitle}>Order Total</div>

              {/* Promo code */}
              {!promoApplied ? (
                <div>
                  <div style={styles.promoRow}>
                    <input
                      type="text"
                      placeholder="PROMO CODE"
                      aria-label="Promo code"
                      style={styles.promoInput}
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        setPromoError('');
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyPromo(); } }}
                    />
                    <button
                      type="button"
                      style={{
                        ...styles.promoBtn,
                        ...(promoLoading || !promoCode.trim() ? styles.promoBtnDisabled : {}),
                      }}
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !promoCode.trim()}
                    >
                      {promoLoading ? '…' : 'Apply'}
                    </button>
                  </div>
                  {promoError && <div style={styles.promoError} role="alert">{promoError}</div>}
                </div>
              ) : (
                <div style={styles.promoApplied}>
                  <span>🏷 {promoApplied.code} applied</span>
                  <button type="button" style={styles.removePromo} onClick={handleRemovePromo} aria-label="Remove promo code">
                    Remove
                  </button>
                </div>
              )}

              <div style={styles.totalsTable}>
                <div style={styles.totalsRow}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div style={styles.totalsRow}>
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div style={styles.totalsRow}>
                  <span>Shipping</span>
                  <span>
                    {shipping === 0
                      ? <span style={styles.freeShipping}>Free</span>
                      : formatCurrency(shipping)}
                  </span>
                </div>
                {discount > 0 && (
                  <div style={styles.totalsRowDiscount}>
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div style={styles.totalsRowBold}>
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {placeError && (
                <div
                  role="alert"
                  style={{
                    marginTop: '12px',
                    padding: '10px 12px',
                    backgroundColor: '#ffe3e3',
                    color: '#f03e3e',
                    borderRadius: '6px',
                    fontSize: '13px',
                  }}
                >
                  {placeError}
                </div>
              )}

              <button
                type="button"
                style={{
                  ...styles.submitBtn,
                  ...(placing ? styles.submitBtnDisabled : {}),
                }}
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? 'Placing Order…' : 'Place Order'}
              </button>

              <p style={{ fontSize: '11px', color: '#495057', textAlign: 'center', marginTop: '10px', lineHeight: '16px' }}>
                By placing your order, you agree to our Terms of Service.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
