import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import emptyStateImg from '@/assets/images/empty-state.svg';
import cartIcon from '@/assets/icons/cart.svg';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function getCartId() {
  return localStorage.getItem('cartId') || 'guest-cart';
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = type === 'error' ? '#f03e3e' : '#37b24d';

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: bg,
        color: '#ffffff',
        padding: '12px 20px',
        borderRadius: '10px',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '14px',
        fontWeight: '500',
        zIndex: 9999,
        boxShadow: '0 4px 12px rgba(33,37,41,0.18)',
        maxWidth: '360px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        style={{
          background: 'none',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          fontSize: '16px',
          padding: '0',
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        padding: '20px',
        background: '#ffffff',
        borderRadius: '10px',
        marginBottom: '12px',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: '96px',
          height: '96px',
          borderRadius: '6px',
          background: '#e9ecef',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ height: '16px', width: '60%', background: '#e9ecef', borderRadius: '3px' }} />
        <div style={{ height: '14px', width: '40%', background: '#e9ecef', borderRadius: '3px' }} />
        <div style={{ height: '14px', width: '30%', background: '#e9ecef', borderRadius: '3px' }} />
      </div>
    </div>
  );
}

function SkeletonSummary() {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '10px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {[80, 60, 70, 90].map((w, i) => (
        <div
          key={i}
          style={{ height: '16px', width: `${w}%`, background: '#e9ecef', borderRadius: '3px' }}
        />
      ))}
    </div>
  );
}

function QuantityControl({ value, onIncrease, onDecrease, disabled }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        border: '1px solid #868e96',
        borderRadius: '6px',
        overflow: 'hidden',
        height: '36px',
      }}
    >
      <button
        onClick={onDecrease}
        disabled={disabled || value <= 1}
        aria-label="Decrease quantity"
        style={{
          width: '36px',
          height: '36px',
          minWidth: '44px',
          minHeight: '44px',
          background: 'none',
          border: 'none',
          cursor: disabled || value <= 1 ? 'not-allowed' : 'pointer',
          color: disabled || value <= 1 ? '#adb5bd' : '#212529',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0',
        }}
      >
        <img src={minusIcon} alt="" width={14} height={14} />
      </button>
      <span
        aria-live="polite"
        style={{
          minWidth: '28px',
          textAlign: 'center',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '16px',
          fontWeight: '500',
          color: '#212529',
        }}
      >
        {value}
      </span>
      <button
        onClick={onIncrease}
        disabled={disabled}
        aria-label="Increase quantity"
        style={{
          width: '36px',
          height: '36px',
          minWidth: '44px',
          minHeight: '44px',
          background: 'none',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          color: disabled ? '#adb5bd' : '#212529',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0',
        }}
      >
        <img src={plusIcon} alt="" width={14} height={14} />
      </button>
    </div>
  );
}

function CartItem({ item, onRemove, onQuantityChange, actionLoading }) {
  const isLoading = actionLoading[item.id];

  const unitPrice = item.unit_price ?? item.price ?? 0;
  const lineTotal = unitPrice * item.quantity;

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        padding: '20px',
        background: '#ffffff',
        borderRadius: '10px',
        marginBottom: '12px',
        alignItems: 'flex-start',
        opacity: isLoading ? 0.6 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      <img
        src={item.image_url || placeholderProduct}
        alt={item.product_name || item.name || 'Product image'}
        style={{
          width: '96px',
          height: '96px',
          objectFit: 'cover',
          borderRadius: '6px',
          flexShrink: 0,
          background: '#f8f9fa',
        }}
        onError={(e) => { e.currentTarget.src = placeholderProduct; }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: '0 0 4px',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '16px',
            fontWeight: '600',
            color: '#212529',
            lineHeight: '24px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.product_name || item.name || 'Unknown Product'}
        </p>
        {item.sku_label && (
          <p
            style={{
              margin: '0 0 8px',
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              fontSize: '12px',
              color: '#495057',
              lineHeight: '16px',
            }}
          >
            {item.sku_label}
          </p>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '8px',
          }}
        >
          <QuantityControl
            value={item.quantity}
            onIncrease={() => onQuantityChange(item.id, item.quantity + 1)}
            onDecrease={() => onQuantityChange(item.id, item.quantity - 1)}
            disabled={isLoading}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span
              style={{
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                fontSize: '16px',
                fontWeight: '700',
                color: '#212529',
              }}
            >
              ${lineTotal.toFixed(2)}
            </span>
            <button
              onClick={() => onRemove(item.id)}
              disabled={isLoading}
              aria-label={`Remove ${item.product_name || item.name || 'item'} from cart`}
              style={{
                background: 'none',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                color: '#f03e3e',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 0',
                minHeight: '44px',
              }}
            >
              <img src={trashIcon} alt="" width={14} height={14} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PromoCodeInput({ cartId, onPromoApplied, showToast }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const result = await apiFetch(`/carts/${cartId}/promo`, {
        method: 'POST',
        body: JSON.stringify({ promo_code: trimmed }),
      });
      onPromoApplied(result);
      showToast('Promo code applied!', 'success');
    } catch (err) {
      showToast(err.message || 'Invalid promo code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Promo code"
        aria-label="Promo code"
        disabled={loading}
        style={{
          flex: 1,
          padding: '10px 12px',
          border: '1px solid #868e96',
          borderRadius: '6px',
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          fontSize: '14px',
          color: '#212529',
          background: loading ? '#e9ecef' : '#ffffff',
          outline: 'none',
          minHeight: '44px',
        }}
        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
      />
      <button
        onClick={handleApply}
        disabled={loading || !code.trim()}
        style={{
          padding: '10px 16px',
          background: loading || !code.trim() ? '#e9ecef' : '#4c6ef5',
          color: loading || !code.trim() ? '#adb5bd' : '#ffffff',
          border: 'none',
          borderRadius: '6px',
          cursor: loading || !code.trim() ? 'not-allowed' : 'pointer',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '14px',
          fontWeight: '600',
          minHeight: '44px',
          whiteSpace: 'nowrap',
        }}
      >
        {loading ? 'Applying…' : 'Apply'}
      </button>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const cartId = getCartId();

  const [status, setStatus] = useState('loading'); // loading | success | error | empty
  const [cart, setCart] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const loadCart = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await apiFetch(`/carts/${cartId}`);
      setCart(data);
      setStatus(data.items && data.items.length > 0 ? 'success' : 'empty');
    } catch {
      setStatus('error');
    }
  }, [cartId]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleRemove = useCallback(async (itemId) => {
    setActionLoading((prev) => ({ ...prev, [itemId]: true }));
    try {
      await apiFetch(`/carts/${cartId}/items/${itemId}`, { method: 'DELETE' });
      setCart((prev) => {
        const updatedItems = prev.items.filter((i) => i.id !== itemId);
        const updatedCart = { ...prev, items: updatedItems };
        if (updatedItems.length === 0) setStatus('empty');
        return updatedCart;
      });
      showToast('Item removed from cart', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to remove item. Please try again.', 'error');
    } finally {
      setActionLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  }, [cartId, showToast]);

  const handleQuantityChange = useCallback(async (itemId, newQuantity) => {
    if (newQuantity < 0) return;
    setActionLoading((prev) => ({ ...prev, [itemId]: true }));
    try {
      const updated = await apiFetch(`/carts/${cartId}/items/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity: newQuantity }),
      });
      setCart((prev) => ({
        ...prev,
        ...updated,
        items: updated.items || prev.items.map((i) =>
          i.id === itemId ? { ...i, quantity: newQuantity } : i
        ),
      }));
    } catch (err) {
      showToast(err.message || 'Failed to update quantity. Please try again.', 'error');
    } finally {
      setActionLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  }, [cartId, showToast]);

  const handlePromoApplied = useCallback((updatedCart) => {
    setCart(updatedCart);
  }, []);

  const handleCheckout = useCallback(() => {
    navigate('/checkout');
  }, [navigate]);

  const itemCount = cart?.items?.length ?? 0;
  const subtotal = cart?.subtotal ?? (cart?.items?.reduce((sum, i) => sum + (i.unit_price ?? i.price ?? 0) * i.quantity, 0) ?? 0);
  const discount = cart?.discount ?? 0;
  const shipping = cart?.shipping_cost ?? 0;
  const total = cart?.total ?? (subtotal - discount + shipping);
  const promoCode = cart?.promo_code || null;

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#f8f9fa',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      padding: '32px 16px 64px',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    pageTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#212529',
      lineHeight: '32px',
      letterSpacing: '-0.01em',
      margin: '0 0 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: '9999px',
      background: '#e8ecfd',
      color: '#3b5bdb',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.02em',
      verticalAlign: 'middle',
    },
    layout: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '24px',
    },
    summaryCard: {
      background: '#ffffff',
      borderRadius: '10px',
      padding: '24px',
      alignSelf: 'start',
      boxShadow: '0 1px 4px rgba(33,37,41,0.06)',
    },
    summaryTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#212529',
      lineHeight: '28px',
      margin: '0 0 20px',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '16px',
      color: '#343a40',
      lineHeight: '24px',
      margin: '0 0 12px',
    },
    summaryDivider: {
      border: 'none',
      borderTop: '1px solid #868e96',
      margin: '16px 0',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '20px',
      fontWeight: '700',
      color: '#212529',
      margin: '0 0 20px',
    },
    checkoutBtn: {
      width: '100%',
      padding: '14px 24px',
      background: '#4c6ef5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      letterSpacing: '0em',
      transition: 'background 0.15s',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      textAlign: 'center',
    },
    errorState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      textAlign: 'center',
    },
  };

  if (status === 'loading') {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.pageTitle}>Your cart</h1>
          <div
            style={{
              ...styles.layout,
              '@media (min-width: 900px)': { gridTemplateColumns: '1fr 360px' },
            }}
          >
            <div>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
            <SkeletonSummary />
          </div>
        </div>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorState}>
            <img
              src={cartIcon}
              alt=""
              width={64}
              height={64}
              style={{ marginBottom: '24px', opacity: 0.35 }}
            />
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#212529',
                margin: '0 0 12px',
              }}
            >
              Couldn't load your cart
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: '#495057',
                margin: '0 0 28px',
                lineHeight: '24px',
              }}
            >
              Please refresh the page.
            </p>
            <button
              onClick={loadCart}
              style={{
                padding: '12px 28px',
                background: '#4c6ef5',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              Refresh
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (status === 'empty') {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.emptyState}>
            <img
              src={emptyStateImg}
              alt="Empty cart"
              style={{ width: '140px', height: 'auto', marginBottom: '32px' }}
            />
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#212529',
                margin: '0 0 12px',
              }}
            >
              Your cart is empty
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: '#495057',
                margin: '0 0 32px',
                lineHeight: '24px',
                maxWidth: '40ch',
              }}
            >
              Looks like you haven't added anything yet. Explore our products and find something you love.
            </p>
            <button
              onClick={() => navigate('/products')}
              style={{
                padding: '14px 32px',
                background: '#4c6ef5',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              Start shopping
            </button>
          </div>
        </div>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={dismissToast} />
        )}
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>
          Your cart
          <span style={styles.badge}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Cart Items Column */}
          <div style={{ minWidth: 0 }}>
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onQuantityChange={handleQuantityChange}
                actionLoading={actionLoading}
              />
            ))}
          </div>

          {/* Order Summary Column */}
          <div style={{ minWidth: '280px' }}>
            <div style={styles.summaryCard}>
              <h2 style={styles.summaryTitle}>Order summary</h2>

              <PromoCodeInput
                cartId={cartId}
                onPromoApplied={handlePromoApplied}
                showToast={showToast}
              />

              {promoCode && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: '#d3f9d8',
                    borderRadius: '6px',
                    marginBottom: '16px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                      fontSize: '13px',
                      color: '#212529',
                      fontWeight: '600',
                    }}
                  >
                    {promoCode}
                  </span>
                  <span style={{ fontSize: '12px', color: '#37b24d', fontWeight: '500', marginLeft: 'auto' }}>
                    Applied ✓
                  </span>
                </div>
              )}

              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div style={{ ...styles.summaryRow, color: '#37b24d' }}>
                  <span>Discount</span>
                  <span>−${discount.toFixed(2)}</span>
                </div>
              )}

              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span style={{ color: '#37b24d', fontWeight: '600' }}>Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <hr style={styles.summaryDivider} />

              <div style={styles.totalRow}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                style={styles.checkoutBtn}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#3b5bdb')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#4c6ef5')}
              >
                Proceed to checkout
              </button>

              <button
                onClick={() => navigate('/products')}
                style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#4c6ef5',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  minHeight: '44px',
                }}
              >
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={dismissToast} />
      )}
    </main>
  );
}
