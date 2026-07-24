import React, { useState, useEffect, useCallback } from 'react';

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pinCode: '',
  isDefault: false,
};

const PIN_REGEX = /^[1-9][0-9]{5}$/;

/**
 * AddressForm
 * Props:
 *   initialValues: object  – pre-fill fields for edit mode
 *   onSubmit: (formData) => void
 *   onCancel: () => void
 *   submitLabel: string    – button label, defaults to "Save Address"
 *   checkServiceability: (pin: string) => Promise<{ serviceable: boolean }>
 */
const AddressForm = ({
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = 'Save Address',
  checkServiceability,
}) => {
  const [form, setForm] = useState({ ...INITIAL_FORM, ...initialValues });
  const [errors, setErrors] = useState({});
  const [pinStatus, setPinStatus] = useState(null); // null | 'checking' | 'serviceable' | 'not_serviceable'
  const [pinChecked, setPinChecked] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.trim()))
      newErrors.phone = 'Enter a valid 10-digit mobile number.';
    if (!form.addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required.';
    if (!form.city.trim()) newErrors.city = 'City is required.';
    if (!form.state.trim()) newErrors.state = 'State is required.';
    if (!PIN_REGEX.test(form.pinCode.trim()))
      newErrors.pinCode = 'Enter a valid 6-digit PIN code.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) {
      setErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  const handlePinBlur = useCallback(async () => {
    const pin = form.pinCode.trim();
    if (!PIN_REGEX.test(pin) || pin === pinChecked) return;
    setPinChecked(pin);
    if (typeof checkServiceability !== 'function') return;
    setPinStatus('checking');
    try {
      const result = await checkServiceability(pin);
      setPinStatus(result.serviceable ? 'serviceable' : 'not_serviceable');
    } catch {
      setPinStatus(null);
    }
  }, [form.pinCode, pinChecked, checkServiceability]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (onSubmit) onSubmit({ ...form });
  };

  return (
    <form className="address-form" onSubmit={handleSubmit} noValidate>
      <div className="address-form__row">
        <div className="address-form__field">
          <label className="address-form__label" htmlFor="af-fullName">Full Name</label>
          <input
            id="af-fullName"
            className={`address-form__input${errors.fullName ? ' address-form__input--error' : ''}`}
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
            autoComplete="name"
          />
          {errors.fullName && <span className="address-form__error">{errors.fullName}</span>}
        </div>
        <div className="address-form__field">
          <label className="address-form__label" htmlFor="af-phone">Phone</label>
          <input
            id="af-phone"
            className={`address-form__input${errors.phone ? ' address-form__input--error' : ''}`}
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            autoComplete="tel"
            maxLength={10}
          />
          {errors.phone && <span className="address-form__error">{errors.phone}</span>}
        </div>
      </div>

      <div className="address-form__field">
        <label className="address-form__label" htmlFor="af-addressLine1">Address Line 1</label>
        <input
          id="af-addressLine1"
          className={`address-form__input${errors.addressLine1 ? ' address-form__input--error' : ''}`}
          type="text"
          name="addressLine1"
          value={form.addressLine1}
          onChange={handleChange}
          placeholder="House/Flat no., Street, Area"
          autoComplete="address-line1"
        />
        {errors.addressLine1 && <span className="address-form__error">{errors.addressLine1}</span>}
      </div>

      <div className="address-form__field">
        <label className="address-form__label" htmlFor="af-addressLine2">Address Line 2 <span className="address-form__optional">(optional)</span></label>
        <input
          id="af-addressLine2"
          className="address-form__input"
          type="text"
          name="addressLine2"
          value={form.addressLine2}
          onChange={handleChange}
          placeholder="Landmark, Colony"
          autoComplete="address-line2"
        />
      </div>

      <div className="address-form__row">
        <div className="address-form__field">
          <label className="address-form__label" htmlFor="af-city">City</label>
          <input
            id="af-city"
            className={`address-form__input${errors.city ? ' address-form__input--error' : ''}`}
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            autoComplete="address-level2"
          />
          {errors.city && <span className="address-form__error">{errors.city}</span>}
        </div>
        <div className="address-form__field">
          <label className="address-form__label" htmlFor="af-state">State</label>
          <input
            id="af-state"
            className={`address-form__input${errors.state ? ' address-form__input--error' : ''}`}
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="State"
            autoComplete="address-level1"
          />
          {errors.state && <span className="address-form__error">{errors.state}</span>}
        </div>
      </div>

      <div className="address-form__row">
        <div className="address-form__field">
          <label className="address-form__label" htmlFor="af-pinCode">PIN Code</label>
          <input
            id="af-pinCode"
            className={`address-form__input${errors.pinCode ? ' address-form__input--error' : ''}`}
            type="text"
            name="pinCode"
            value={form.pinCode}
            onChange={handleChange}
            onBlur={handlePinBlur}
            placeholder="6-digit PIN"
            autoComplete="postal-code"
            maxLength={6}
          />
          {errors.pinCode && <span className="address-form__error">{errors.pinCode}</span>}
          {!errors.pinCode && pinStatus === 'checking' && (
            <span className="address-form__pin-status address-form__pin-status--checking">Checking serviceability…</span>
          )}
          {!errors.pinCode && pinStatus === 'serviceable' && (
            <span className="address-form__pin-status address-form__pin-status--ok">✓ Delivery available at this PIN</span>
          )}
          {!errors.pinCode && pinStatus === 'not_serviceable' && (
            <span className="address-form__pin-status address-form__pin-status--error">✗ Delivery not available at this PIN</span>
          )}
        </div>
      </div>

      <div className="address-form__checkbox-row">
        <input
          id="af-isDefault"
          type="checkbox"
          name="isDefault"
          checked={form.isDefault}
          onChange={handleChange}
          className="address-form__checkbox"
        />
        <label htmlFor="af-isDefault" className="address-form__checkbox-label">Set as default address</label>
      </div>

      <div className="address-form__actions">
        {onCancel && (
          <button type="button" className="address-form__btn address-form__btn--secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="address-form__btn address-form__btn--primary">
          {submitLabel}
        </button>
      </div>

      <style>{`
        .address-form { width: 100%; }
        .address-form__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .address-form__field {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }
        .address-form__label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
        }
        .address-form__optional {
          font-weight: 400;
          color: #9ca3af;
        }
        .address-form__input {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          color: #111827;
          outline: none;
          transition: border-color 0.2s;
        }
        .address-form__input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37,99,235,0.15);
        }
        .address-form__input--error {
          border-color: #dc2626;
        }
        .address-form__error {
          font-size: 12px;
          color: #dc2626;
          margin-top: 4px;
        }
        .address-form__pin-status {
          font-size: 12px;
          margin-top: 4px;
        }
        .address-form__pin-status--checking { color: #6b7280; }
        .address-form__pin-status--ok { color: #16a34a; }
        .address-form__pin-status--error { color: #dc2626; }
        .address-form__checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .address-form__checkbox { width: 16px; height: 16px; cursor: pointer; }
        .address-form__checkbox-label { font-size: 13px; color: #374151; cursor: pointer; }
        .address-form__actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        .address-form__btn {
          padding: 10px 24px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
        }
        .address-form__btn--primary {
          background: #2563eb;
          color: #ffffff;
        }
        .address-form__btn--primary:hover { background: #1d4ed8; }
        .address-form__btn--secondary {
          background: #f3f4f6;
          color: #374151;
        }
        .address-form__btn--secondary:hover { background: #e5e7eb; }
        @media (max-width: 480px) {
          .address-form__row { grid-template-columns: 1fr; }
        }
      `}</style>
    </form>
  );
};

export default AddressForm;
