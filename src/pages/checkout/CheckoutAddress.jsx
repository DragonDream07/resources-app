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
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    marginBottom: '20px',
    color: '#212529',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  formGroupFull: {
    gridColumn: '1 / -1',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
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
  },
  inputError: {
    border: '1px solid #f03e3e',
    backgroundColor: '#ffe3e3',
  },
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    lineHeight: '16px',
  },
  pinRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  pinInputWrap: {
    flex: 1,
  },
  checkBtn: {
    padding: '12px 16px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    whiteSpace: 'nowrap',
  },
  checkBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  serviceabilityMsg: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
    fontSize: '14px',
    lineHeight: '20px',
  },
  serviceable: {
    color: '#37b24d',
    backgroundColor: '#d3f9d8',
    padding: '6px 10px',
    borderRadius: '6px',
  },
  notServiceable: {
    color: '#f03e3e',
    backgroundColor: '#ffe3e3',
    padding: '6px 10px',
    borderRadius: '6px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '20px 0',
  },
  savedAddressItem: {
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  savedAddressSelected: {
    border: '2px solid #4c6ef5',
    backgroundColor: '#e8ecfd',
  },
  radio: {
    marginTop: '2px',
    accentColor: '#4c6ef5',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  addressText: {
    fontSize: '14px',
    lineHeight: '20px',
    color: '#343a40',
  },
  submitBtn: {
    marginTop: '24px',
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
  },
  submitBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
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
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#495057',
    marginBottom: '8px',
  },
  mapPinIcon: {
    width: '16px',
    height: '16px',
    verticalAlign: 'middle',
    marginRight: '4px',
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

export default function CheckoutAddress() {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNew, setUseNew] = useState(true);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [errors, setErrors] = useState({});

  const [pinChecking, setPinChecking] = useState(false);
  const [pinServiceable, setPinServiceable] = useState(null);
  const [pinMessage, setPinMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (token) {
      apiGet('/users/me/addresses', token)
        .then((data) => {
          const list = Array.isArray(data) ? data : data.addresses || [];
          setSavedAddresses(list);
          if (list.length > 0) {
            setUseNew(false);
            setSelectedAddressId(list[0].id);
          }
        })
        .catch(() => {
          setSavedAddresses([]);
        });
    }
  }, [token]);

  function handleField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === 'pincode') {
      setPinServiceable(null);
      setPinMessage('');
    }
  }

  async function handleCheckServiceability() {
    if (!form.pincode || form.pincode.length < 5) return;
    setPinChecking(true);
    setPinServiceable(null);
    setPinMessage('');
    try {
      const data = await apiGet(`/serviceability?pincode=${form.pincode}`, token);
      const serviceable = data.serviceable === true || data.is_serviceable === true;
      setPinServiceable(serviceable);
      setPinMessage(serviceable ? 'Delivery available to this pincode.' : 'Delivery not available to this pincode.');
    } catch {
      setPinServiceable(false);
      setPinMessage('Could not verify serviceability. Please try again.');
    } finally {
      setPinChecking(false);
    }
  }

  function validate() {
    const e = {};
    if (useNew) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required.';
      if (!form.phone.trim()) e.phone = 'Phone number is required.';
      else if (!/^[0-9+\-\s]{7,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number.';
      if (!form.line1.trim()) e.line1 = 'Address line 1 is required.';
      if (!form.city.trim()) e.city = 'City is required.';
      if (!form.state.trim()) e.state = 'State is required.';
      if (!form.pincode.trim()) e.pincode = 'Pincode is required.';
      else if (!/^[0-9]{5,10}$/.test(form.pincode.trim())) e.pincode = 'Enter a valid pincode.';
    } else {
      if (!selectedAddressId) e.address = 'Please select a delivery address.';
    }
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      let payload;
      if (useNew) {
        payload = { ...form, isNew: true };
      } else {
        payload = { addressId: selectedAddressId, isNew: false };
      }
      await apiPost('/checkout/address', payload, token);
      navigate('/checkout/payment');
    } catch (err) {
      setSubmitError(
        err?.data?.detail || err?.data?.message || 'Failed to save address. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Step indicator */}
        <nav style={styles.stepIndicator} aria-label="Checkout steps">
          <span style={styles.stepActive}>1. Address</span>
          <span style={styles.stepDivider}>›</span>
          <span style={styles.stepInactive}>2. Payment</span>
          <span style={styles.stepDivider}>›</span>
          <span style={styles.stepInactive}>3. Review</span>
        </nav>

        <h1 style={styles.heading}>Delivery Address</h1>

        <div style={styles.layout}>
          <form onSubmit={handleSubmit} noValidate>
            {/* Saved addresses */}
            {savedAddresses.length > 0 && (
              <div style={styles.card}>
                <div style={styles.sectionTitle}>Saved Addresses</div>
                {savedAddresses.map((addr) => (
                  <label
                    key={addr.id}
                    style={{
                      ...styles.savedAddressItem,
                      ...(!useNew && selectedAddressId === addr.id ? styles.savedAddressSelected : {}),
                    }}
                  >
                    <input
                      type="radio"
                      style={styles.radio}
                      name="savedAddress"
                      value={addr.id}
                      checked={!useNew && selectedAddressId === addr.id}
                      onChange={() => {
                        setUseNew(false);
                        setSelectedAddressId(addr.id);
                        setErrors({});
                      }}
                    />
                    <div style={styles.addressText}>
                      <strong>{addr.fullName || addr.full_name}</strong>
                      <br />
                      {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                      <br />
                      {addr.city}, {addr.state} – {addr.pincode || addr.zip}
                      <br />
                      {addr.phone}
                    </div>
                  </label>
                ))}
                {errors.address && <div style={styles.errorText}>{errors.address}</div>}
                <hr style={styles.divider} />
                <label style={{ ...styles.savedAddressItem, ...(useNew ? styles.savedAddressSelected : {}) }}>
                  <input
                    type="radio"
                    style={styles.radio}
                    name="savedAddress"
                    value="new"
                    checked={useNew}
                    onChange={() => {
                      setUseNew(true);
                      setSelectedAddressId(null);
                      setErrors({});
                    }}
                  />
                  <span style={styles.addressText}>Use a new address</span>
                </label>
              </div>
            )}

            {/* New address form */}
            {useNew && (
              <div style={{ ...styles.card, marginTop: savedAddresses.length > 0 ? '20px' : '0' }}>
                <div style={styles.sectionTitle}>New Delivery Address</div>
                <div style={styles.formGrid}>
                  <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                    <label style={styles.label} htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      style={{ ...styles.input, ...(errors.fullName ? styles.inputError : {}) }}
                      value={form.fullName}
                      onChange={handleField}
                      placeholder="Jane Doe"
                    />
                    {errors.fullName && <span style={styles.errorText}>{errors.fullName}</span>}
                  </div>

                  <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                    <label style={styles.label} htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      style={{ ...styles.input, ...(errors.phone ? styles.inputError : {}) }}
                      value={form.phone}
                      onChange={handleField}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
                  </div>

                  <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                    <label style={styles.label} htmlFor="line1">Address Line 1</label>
                    <input
                      id="line1"
                      name="line1"
                      type="text"
                      autoComplete="address-line1"
                      style={{ ...styles.input, ...(errors.line1 ? styles.inputError : {}) }}
                      value={form.line1}
                      onChange={handleField}
                      placeholder="House / Flat / Block No."
                    />
                    {errors.line1 && <span style={styles.errorText}>{errors.line1}</span>}
                  </div>

                  <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                    <label style={styles.label} htmlFor="line2">Address Line 2 <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                    <input
                      id="line2"
                      name="line2"
                      type="text"
                      autoComplete="address-line2"
                      style={styles.input}
                      value={form.line2}
                      onChange={handleField}
                      placeholder="Street / Area / Landmark"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="city">City</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      autoComplete="address-level2"
                      style={{ ...styles.input, ...(errors.city ? styles.inputError : {}) }}
                      value={form.city}
                      onChange={handleField}
                      placeholder="Mumbai"
                    />
                    {errors.city && <span style={styles.errorText}>{errors.city}</span>}
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="state">State</label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      autoComplete="address-level1"
                      style={{ ...styles.input, ...(errors.state ? styles.inputError : {}) }}
                      value={form.state}
                      onChange={handleField}
                      placeholder="Maharashtra"
                    />
                    {errors.state && <span style={styles.errorText}>{errors.state}</span>}
                  </div>

                  <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                    <label style={styles.label} htmlFor="pincode">Pincode</label>
                    <div style={styles.pinRow}>
                      <div style={{ ...styles.pinInputWrap, ...styles.formGroup }}>
                        <input
                          id="pincode"
                          name="pincode"
                          type="text"
                          inputMode="numeric"
                          autoComplete="postal-code"
                          style={{ ...styles.input, ...(errors.pincode ? styles.inputError : {}) }}
                          value={form.pincode}
                          onChange={handleField}
                          placeholder="400001"
                          maxLength={10}
                        />
                        {errors.pincode && <span style={styles.errorText}>{errors.pincode}</span>}
                      </div>
                      <button
                        type="button"
                        style={{
                          ...styles.checkBtn,
                          ...(pinChecking || form.pincode.length < 5 ? styles.checkBtnDisabled : {}),
                        }}
                        onClick={handleCheckServiceability}
                        disabled={pinChecking || form.pincode.length < 5}
                        aria-label="Check PIN serviceability"
                      >
                        {pinChecking ? 'Checking…' : 'Check PIN'}
                      </button>
                    </div>
                    {pinServiceable !== null && (
                      <div
                        style={{
                          ...styles.serviceabilityMsg,
                          ...(pinServiceable ? styles.serviceable : styles.notServiceable),
                        }}
                        role="status"
                        aria-live="polite"
                      >
                        {pinServiceable ? '✓' : '✗'} {pinMessage}
                      </div>
                    )}
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="country">Country</label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      autoComplete="country-name"
                      style={styles.input}
                      value={form.country}
                      onChange={handleField}
                    />
                  </div>
                </div>
              </div>
            )}

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
              {submitting ? 'Saving…' : 'Continue to Payment'}
            </button>
          </form>

          {/* Summary sidebar */}
          <aside style={styles.summarySidebar}>
            <div style={styles.summaryTitle}>Order Summary</div>
            <p style={{ fontSize: '14px', color: '#495057', lineHeight: '20px' }}>
              Your order details will be shown on the Review page after you enter your address and
              payment information.
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '16px',
                fontSize: '12px',
                color: '#495057',
              }}
            >
              <img src="/src/assets/icons/map-pin.svg" alt="" style={styles.mapPinIcon} />
              We verify PIN serviceability before confirming delivery.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
