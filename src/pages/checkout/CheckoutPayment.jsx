import React, { useState } from 'react';
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
  },
  tabRow: {
    display: 'flex',
    gap: '0',
    borderBottom: '2px solid #e9ecef',
    marginBottom: '24px',
  },
  tab: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    color: '#495057',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    minHeight: '44px',
  },
  tabActive: {
    color: '#4c6ef5',
    borderBottom: '2px solid #4c6ef5',
    fontWeight: '600',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '16px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    lineHeight: '16px',
  },
  input: {
    padding: '12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#212529',
    backgroundColor: '#ffffff',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  inputError: {
    border: '1px solid #f03e3e',
    backgroundColor: '#ffe3e3',
  },
  inputMono: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    letterSpacing: '0.1em',
  },
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    lineHeight: '16px',
  },
  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  testModeBanner: {
    backgroundColor: '#fff4e6',
    border: '1px solid #fd7e14',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#495057',
    lineHeight: '20px',
    marginBottom: '20px',
  },
  testCardHint: {
    backgroundColor: '#e8ecfd',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '12px',
    color: '#3b5bdb',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    lineHeight: '20px',
    marginBottom: '20px',
  },
  submitBtn: {
    marginTop: '8px',
    padding: '14px 24px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
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
  },
  lockNote: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#495057',
    marginTop: '12px',
    justifyContent: 'center',
  },
  upiGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '16px',
  },
  radioOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '8px',
  },
  radioOptionSelected: {
    border: '2px solid #4c6ef5',
    backgroundColor: '#e8ecfd',
  },
  summarySidebar: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    border: '1px solid #e9ecef',
  },
  summaryTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#212529',
  },
};

const TEST_CARD = {
  number: '4111 1111 1111 1111',
  expiry: '12/26',
  cvv: '123',
  name: 'Test User',
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

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

const PAYMENT_METHODS = ['Card', 'UPI', 'COD', 'Wallet'];

const UPI_APPS = ['Google Pay', 'PhonePe', 'Paytm', 'Other'];

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const [method, setMethod] = useState('Card');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiApp, setUpiApp] = useState('Google Pay');
  const [upiId, setUpiId] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const isTestMode = import.meta.env.VITE_PAYMENT_TEST_MODE === 'true' || !import.meta.env.VITE_PAYMENT_GATEWAY_KEY;

  function handleCardField(e) {
    const { name, value } = e.target;
    setCard((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function fillTestCard() {
    setCard(TEST_CARD);
    setErrors({});
  }

  function validateCard() {
    const e = {};
    if (!card.number.replace(/\s/g, '').match(/^\d{13,19}$/)) e.number = 'Enter a valid card number.';
    if (!card.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) e.expiry = 'Enter expiry as MM/YY.';
    if (!card.cvv.match(/^\d{3,4}$/)) e.cvv = 'Enter a valid CVV.';
    if (!card.name.trim()) e.name = 'Cardholder name is required.';
    return e;
  }

  function validateUPI() {
    const e = {};
    if (!upiId.trim()) e.upiId = 'UPI ID is required.';
    else if (!upiId.includes('@')) e.upiId = 'Enter a valid UPI ID (e.g. name@upi).';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let errs = {};
    if (method === 'Card') errs = validateCard();
    if (method === 'UPI') errs = validateUPI();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      let payload = { method };
      if (method === 'Card') {
        payload.card = {
          number: card.number.replace(/\s/g, ''),
          expiry: card.expiry,
          cvv: card.cvv,
          name: card.name,
        };
      } else if (method === 'UPI') {
        payload.upi = { app: upiApp, id: upiId };
      }
      if (isTestMode) {
        payload.testMode = true;
      }
      await apiPost('/payments/initiate', payload, token);
      navigate('/checkout/review');
    } catch (err) {
      setSubmitError(
        err?.data?.detail || err?.data?.message || 'Payment initiation failed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <nav style={styles.stepIndicator} aria-label="Checkout steps">
          <span style={styles.stepDone}>✓ 1. Address</span>
          <span style={styles.stepDivider}>›</span>
          <span style={styles.stepActive}>2. Payment</span>
          <span style={styles.stepDivider}>›</span>
          <span style={styles.stepInactive}>3. Review</span>
        </nav>

        <button style={styles.backLink} onClick={() => navigate('/checkout/address')} type="button">
          ← Back to Address
        </button>

        <h1 style={styles.heading}>Payment Details</h1>

        <div style={styles.layout}>
          <form onSubmit={handleSubmit} noValidate>
            {isTestMode && (
              <div style={styles.testModeBanner} role="note">
                <strong>Test Mode</strong> — No real payments will be processed.
                {method === 'Card' && (
                  <>
                    {' '}
                    <button
                      type="button"
                      onClick={fillTestCard}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#4c6ef5',
                        cursor: 'pointer',
                        fontSize: '13px',
                        padding: 0,
                        textDecoration: 'underline',
                      }}
                    >
                      Fill test card
                    </button>
                  </>
                )}
              </div>
            )}

            {isTestMode && method === 'Card' && (
              <div style={styles.testCardHint}>
                Test card: {TEST_CARD.number} | Exp: {TEST_CARD.expiry} | CVV: {TEST_CARD.cvv}
              </div>
            )}

            {/* Payment method tabs */}
            <div style={styles.card}>
              <div style={styles.tabRow} role="tablist" aria-label="Payment methods">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m}
                    role="tab"
                    aria-selected={method === m}
                    type="button"
                    style={{ ...styles.tab, ...(method === m ? styles.tabActive : {}) }}
                    onClick={() => {
                      setMethod(m);
                      setErrors({});
                      setSubmitError('');
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Card form */}
              {method === 'Card' && (
                <div role="tabpanel">
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="card-number">Card Number</label>
                    <input
                      id="card-number"
                      name="number"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      maxLength={19}
                      placeholder="1234 5678 9012 3456"
                      style={{
                        ...styles.input,
                        ...styles.inputMono,
                        ...(errors.number ? styles.inputError : {}),
                      }}
                      value={card.number}
                      onChange={handleCardField}
                    />
                    {errors.number && <span style={styles.errorText}>{errors.number}</span>}
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="card-name">Name on Card</label>
                    <input
                      id="card-name"
                      name="name"
                      type="text"
                      autoComplete="cc-name"
                      placeholder="Jane Doe"
                      style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
                      value={card.name}
                      onChange={handleCardField}
                    />
                    {errors.name && <span style={styles.errorText}>{errors.name}</span>}
                  </div>

                  <div style={styles.row2}>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="card-expiry">Expiry (MM/YY)</label>
                      <input
                        id="card-expiry"
                        name="expiry"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        maxLength={5}
                        placeholder="MM/YY"
                        style={{
                          ...styles.input,
                          ...styles.inputMono,
                          ...(errors.expiry ? styles.inputError : {}),
                        }}
                        value={card.expiry}
                        onChange={handleCardField}
                      />
                      {errors.expiry && <span style={styles.errorText}>{errors.expiry}</span>}
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="card-cvv">CVV</label>
                      <input
                        id="card-cvv"
                        name="cvv"
                        type="password"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        maxLength={4}
                        placeholder="•••"
                        style={{
                          ...styles.input,
                          ...styles.inputMono,
                          ...(errors.cvv ? styles.inputError : {}),
                        }}
                        value={card.cvv}
                        onChange={handleCardField}
                      />
                      {errors.cvv && <span style={styles.errorText}>{errors.cvv}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* UPI form */}
              {method === 'UPI' && (
                <div role="tabpanel">
                  <div style={styles.formGroup}>
                    <div style={styles.label}>Select UPI App</div>
                    {UPI_APPS.map((app) => (
                      <label
                        key={app}
                        style={{
                          ...styles.radioOption,
                          ...(upiApp === app ? styles.radioOptionSelected : {}),
                        }}
                      >
                        <input
                          type="radio"
                          name="upiApp"
                          value={app}
                          checked={upiApp === app}
                          onChange={() => setUpiApp(app)}
                          style={{ accentColor: '#4c6ef5' }}
                        />
                        {app}
                      </label>
                    ))}
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="upi-id">UPI ID</label>
                    <input
                      id="upi-id"
                      name="upiId"
                      type="text"
                      placeholder="yourname@upi"
                      style={{
                        ...styles.input,
                        ...styles.inputMono,
                        ...(errors.upiId ? styles.inputError : {}),
                      }}
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        setErrors((prev) => ({ ...prev, upiId: '' }));
                      }}
                    />
                    {errors.upiId && <span style={styles.errorText}>{errors.upiId}</span>}
                  </div>
                </div>
              )}

              {/* COD */}
              {method === 'COD' && (
                <div role="tabpanel" style={{ padding: '8px 0', fontSize: '14px', color: '#495057', lineHeight: '20px' }}>
                  <p>Pay with cash when your order is delivered. A small convenience fee may apply.</p>
                </div>
              )}

              {/* Wallet */}
              {method === 'Wallet' && (
                <div role="tabpanel" style={{ padding: '8px 0', fontSize: '14px', color: '#495057', lineHeight: '20px' }}>
                  <p>Your linked wallet balance will be used to pay for this order at checkout.</p>
                </div>
              )}
            </div>

            {submitError && (
              <div
                role="alert"
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: '#ffe3e3',
                  color: '#f03e3e',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                {submitError}
              </div>
            )}

            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                ...(submitting ? styles.submitBtnDisabled : {}),
              }}
              disabled={submitting}
            >
              {submitting ? 'Processing…' : 'Continue to Review'}
            </button>

            <div style={styles.lockNote}>
              🔒 Your payment information is encrypted and secure.
            </div>
          </form>

          <aside style={styles.summarySidebar}>
            <div style={styles.summaryTitle}>Order Summary</div>
            <p style={{ fontSize: '14px', color: '#495057', lineHeight: '20px' }}>
              Total charges including taxes and shipping will be shown on the Review page.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
