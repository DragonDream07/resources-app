import React, { useState, useEffect } from 'react';

/**
 * BrandForm — Create/edit brand form.
 * Props:
 *   initialData  {object|null}   — brand data for edit mode
 *   onSubmit     {function(formData): Promise<void>}
 *   onCancel     {function}
 */
const BrandForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    website_url: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        website_url: initialData.website_url || '',
        is_active: initialData.is_active !== undefined ? initialData.is_active : true,
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
      await onSubmit(form);
    } catch (err) {
      setError(err?.message || 'Failed to save brand.');
    } finally {
      setLoading(false);
    }
  };

  const submitLabel = loading ? 'Saving…' : initialData ? 'Update Brand' : 'Create Brand';

  return (
    <form className="brand-form admin-form" onSubmit={handleSubmit}>
      <h2 className="admin-form__title">
        {initialData ? 'Edit Brand' : 'New Brand'}
      </h2>

      {error && <p className="form-error">{error}</p>}

      <div className="admin-form__field">
        <label htmlFor="brand-name">Name</label>
        <input
          id="brand-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="admin-form__field">
        <label htmlFor="brand-slug">Slug</label>
        <input
          id="brand-slug"
          name="slug"
          type="text"
          value={form.slug}
          onChange={handleChange}
          required
        />
      </div>

      <div className="admin-form__field">
        <label htmlFor="brand-description">Description</label>
        <textarea
          id="brand-description"
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="admin-form__field">
        <label htmlFor="brand-website">Website URL</label>
        <input
          id="brand-website"
          name="website_url"
          type="url"
          value={form.website_url}
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
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default BrandForm;
