import React, { useState, useEffect } from 'react';

/**
 * CategoryForm — Create/edit category form with parent selector.
 * Props:
 *   initialData  {object|null}   — category data for edit mode
 *   categories   {Array}         — [{ id, name }] — all categories for parent selection
 *   onSubmit     {function(formData): Promise<void>}
 *   onCancel     {function}
 */
const CategoryForm = ({ initialData = null, categories = [], onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    parent_id: '',
    description: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        slug: initialData.slug || '',
        parent_id: initialData.parent_id || '',
        description: initialData.description || '',
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
      await onSubmit({
        ...form,
        parent_id: form.parent_id || null,
      });
    } catch (err) {
      setError(err?.message || 'Failed to save category.');
    } finally {
      setLoading(false);
    }
  };

  const availableParents = initialData
    ? categories.filter((c) => c.id !== initialData.id)
    : categories;

  return (
    <form className="category-form admin-form" onSubmit={handleSubmit}>
      <h2 className="admin-form__title">
        {initialData ? 'Edit Category' : 'New Category'}
      </h2>

      {error && <p className="form-error">{error}</p>}

      <div className="admin-form__field">
        <label htmlFor="category-name">Name</label>
        <input
          id="category-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="admin-form__field">
        <label htmlFor="category-slug">Slug</label>
        <input
          id="category-slug"
          name="slug"
          type="text"
          value={form.slug}
          onChange={handleChange}
          required
        />
      </div>

      <div className="admin-form__field">
        <label htmlFor="category-parent">Parent Category</label>
        <select
          id="category-parent"
          name="parent_id"
          value={form.parent_id}
          onChange={handleChange}
        >
          <option value="">None (top-level)</option>
          {availableParents.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-form__field">
        <label htmlFor="category-description">Description</label>
        <textarea
          id="category-description"
          name="description"
          rows={3}
          value={form.description}
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
          {loading ? 'Saving…' : initialData ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
