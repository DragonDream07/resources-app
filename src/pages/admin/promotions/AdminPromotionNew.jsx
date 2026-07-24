import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import chevronLeftIcon from '@/assets/icons/chevron-left.svg';

const INITIAL_FORM = {
  code: '',
  type: 'percentage',
  discount: '',
  expiry: '',
  active: true,
  min_order_value: '',
  max_uses: '',
};

export default function AdminPromotionNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  function validate() {
    const errs = {};
    if (!form.code.trim()) errs.code = 'Code is required.';
    if (!form.type) errs.type = 'Type is required.';
    if (!form.discount) {
      errs.discount = 'Discount value is required.';
    } else if (isNaN(Number(form.discount)) || Number(form.discount) <= 0) {
      errs.discount = 'Discount must be a positive number.';
    } else if (form.type === 'percentage' && Number(form.discount) > 100) {
      errs.discount = 'Percentage discount cannot exceed 100.';
    }
    if (form.min_order_value && (isNaN(Number(form.min_order_value)) || Number(form.min_order_value) < 0)) {
      errs.min_order_value = 'Minimum order value must be a non-negative number.';
    }
    if (form.max_uses && (isNaN(Number(form.max_uses)) || !Number.isInteger(Number(form.max_uses)) || Number(form.max_uses) < 1)) {
      errs.max_uses = 'Max uses must be a positive integer.';
    }
    return errs;
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setServerError(null);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        type: form.type,
        discount: Number(form.discount),
        expiry: form.expiry || null,
        active: form.active,
        min_order_value: form.min_order_value ? Number(form.min_order_value) : null,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
      };
      const res = await fetch('/api/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail ?? data.message ?? 'Failed to create promo code');
      }
      navigate('/admin/promotions');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <Link to="/admin/promotions" className="back-link">
          <img src={chevronLeftIcon} alt="" className="back-link__icon" />
          Promo Codes
        </Link>
        <h1 className="admin-page__title">New Promo Code</h1>
      </div>

      {serverError && (
        <div className="form-error form-error--server" role="alert">
          {serverError}
        </div>
      )}

      <form className="admin-form" onSubmit={handleSubmit} noValidate>
        <div className="admin-form__section">
          <div className="form-group">
            <label htmlFor="code" className="form-label">
              Promo Code <span aria-hidden="true">*</span>
            </label>
            <input
              id="code"
              name="code"
              type="text"
              className={`form-input${errors.code ? ' form-input--error' : ''}`}
              value={form.code}
              onChange={handleChange}
              placeholder="e.g. SUMMER20"
              autoComplete="off"
              aria-describedby={errors.code ? 'code-error' : undefined}
              aria-required="true"
            />
            {errors.code && (
              <span id="code-error" className="form-error" role="alert">
                {errors.code}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="type" className="form-label">
              Discount Type <span aria-hidden="true">*</span>
            </label>
            <select
              id="type"
              name="type"
              className={`form-select${errors.type ? ' form-select--error' : ''}`}
              value={form.type}
              onChange={handleChange}
              aria-describedby={errors.type ? 'type-error' : undefined}
              aria-required="true"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
            {errors.type && (
              <span id="type-error" className="form-error" role="alert">
                {errors.type}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="discount" className="form-label">
              Discount Value <span aria-hidden="true">*</span>
            </label>
            <div className="input-addon-wrapper">
              {form.type === 'fixed' && <span className="input-addon input-addon--prefix">$</span>}
              <input
                id="discount"
                name="discount"
                type="number"
                min="0"
                step={form.type === 'percentage' ? '1' : '0.01'}
                max={form.type === 'percentage' ? '100' : undefined}
                className={`form-input${errors.discount ? ' form-input--error' : ''}${form.type === 'fixed' ? ' form-input--has-prefix' : ''}`}
                value={form.discount}
                onChange={handleChange}
                placeholder={form.type === 'percentage' ? 'e.g. 20' : 'e.g. 10.00'}
                aria-describedby={errors.discount ? 'discount-error' : undefined}
                aria-required="true"
              />
              {form.type === 'percentage' && <span className="input-addon input-addon--suffix">%</span>}
            </div>
            {errors.discount && (
              <span id="discount-error" className="form-error" role="alert">
                {errors.discount}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="expiry" className="form-label">
              Expiry Date
            </label>
            <input
              id="expiry"
              name="expiry"
              type="date"
              className="form-input"
              value={form.expiry}
              onChange={handleChange}
            />
            <span className="form-hint">Leave blank for no expiry.</span>
          </div>

          <div className="form-group">
            <label htmlFor="min_order_value" className="form-label">
              Minimum Order Value
            </label>
            <div className="input-addon-wrapper">
              <span className="input-addon input-addon--prefix">$</span>
              <input
                id="min_order_value"
                name="min_order_value"
                type="number"
                min="0"
                step="0.01"
                className={`form-input form-input--has-prefix${errors.min_order_value ? ' form-input--error' : ''}`}
                value={form.min_order_value}
                onChange={handleChange}
                placeholder="e.g. 50.00"
                aria-describedby={errors.min_order_value ? 'min-order-error' : undefined}
              />
            </div>
            {errors.min_order_value && (
              <span id="min-order-error" className="form-error" role="alert">
                {errors.min_order_value}
              </span>
            )}
            <span className="form-hint">Leave blank for no minimum.</span>
          </div>

          <div className="form-group">
            <label htmlFor="max_uses" className="form-label">
              Max Uses
            </label>
            <input
              id="max_uses"
              name="max_uses"
              type="number"
              min="1"
              step="1"
              className={`form-input${errors.max_uses ? ' form-input--error' : ''}`}
              value={form.max_uses}
              onChange={handleChange}
              placeholder="e.g. 100"
              aria-describedby={errors.max_uses ? 'max-uses-error' : undefined}
            />
            {errors.max_uses && (
              <span id="max-uses-error" className="form-error" role="alert">
                {errors.max_uses}
              </span>
            )}
            <span className="form-hint">Leave blank for unlimited uses.</span>
          </div>

          <div className="form-group form-group--checkbox">
            <label className="form-checkbox">
              <input
                id="active"
                name="active"
                type="checkbox"
                checked={form.active}
                onChange={handleChange}
                className="form-checkbox__input"
              />
              <span className="form-checkbox__label">Active</span>
            </label>
          </div>
        </div>

        <div className="admin-form__actions">
          <Link to="/admin/promotions" className="btn btn--secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Promo Code'}
          </button>
        </div>
      </form>
    </div>
  );
}
