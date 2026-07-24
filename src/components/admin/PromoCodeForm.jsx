import React, { useState, useEffect } from 'react';

/**
 * PromoCodeForm — Create/edit promo code form.
 * Props:
 *   initialData  {object|null}   — promo code data for edit mode
 *   onSubmit     {function(formData): Promise<void>}
 *   onCancel     {function}
 */
const PROMO_TYPES = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'flat', label: 'Flat Amount' },
];

const PromoCodeForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    code: '',
    type: 'percentage',
    value: '',
    expiry_date: '',
    min_order_amount: '',
    usage_limit: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code || '',
        type: initialData.type || 'percentage',
        value: initialData.value !== undefined ? String(initialData.value) : '',
        expiry_date: initialData.expiry_date
          ? initialData.expiry_date.substring(0, 10)
          : '',
        min_order_amount:
          initialData.min_order_amount !== undefined
            ? String(initialData.min_order_amount)
            : '',
        usage_limit:
          initialData.usage_limit !== undefined
            ? String(initialData.usage_limit)
            : '',
        is_active:
          initialData.is_active !== undefined ? initialData.is_active : true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        ...form,
        value: parseFloat(form.value),
        min_order_amount: form.min_order_amount
          ? parseFloat(form.min_order_amount)
          : null,
        usage_limit: form.usage_limit ? parseInt(form.usage_limit, 10) : null,
      });
    } catch (err) {
      setError(err?.message || 'Failed to save promo code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="promo-code-form admin-form" onSubmit={handleSubmit}>
      <h2 className="admin-form__title">
        {initialData ? 'Edit Promo Code' : 'New Promo Code'}
      </h2>

      {error && <p className="form-error">{error}</p>}

      <div className="admin-form__field">
        <label htmlFor="promo-code">Code</label>
        <input
          id="promo-code"
          name="code"
          type="text"
          value={form.code}
          onChange={handleChange}
          required
          style={{ textTransform: 'uppercase' }}
        />
      </div>

      <div className="admin-form__field">
        <label htmlFor="promo-type">Discount Type</label>
        <select
          id="promo-type"
          name="type"
          value={form.type}
          onChange={handleChange}
          required
        >
          {PROMO_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-form__field">
        <label htmlFor="promo-value">
          {form.type === 'percentage' ? 'Discount (%)' : 'Discount Amount'}
        </label>
        <input
          id="promo-value"
          name="value"
          type="number"
          min="0"
          step={form.type === 'percentage' ? '1' : '0.01'}
          max={form.type === 'percentage' ? '100' : undefined}
          value={form.value}
          onChange={handleChange}
          required
        />
      </div>

      <div className="admin-form__field">
        <label htmlFor="promo-expiry">Expiry Date</label>
        <input
          id="promo-expiry"
          name="expiry_date"
          type="date"
          value={form.expiry_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="admin-form__field">
        <label htmlFor="promo-min-order">Minimum Order Amount</label>
        <input
          id="promo-min-order"
          name="min_order_amount"
          type="number"
          min="0"
          step="0.01"
          value={form.min_order_amount}
          onChange={handleChange}
        />
      </div>

      <div className="admin-form__field">
        <label htmlFor="promo-usage-limit">Usage Limit</label>
        <input
          id="promo-usage-limit"
          name="usage_limit"
          type="number"
          min="0"
          value={form.usage_limit}
          onChange={handleChange}
        />
      </div>

      <div className="admin-form__field admin-form__field--checkbox">
        <label>
          <input
            name="is_active"
            type="checkbox"
            checked={form.is_active}
            onChange={handleChange}
          />{' '}
          Active
        </label>
      </div>

      <div className="admin-form__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading
            ? 'Saving…'
            : initialData
            ? 'Update Promo Code'
            : 'Create Promo Code'}
        </button>
      </div>
    </form>
  );
};

export default PromoCodeForm;
