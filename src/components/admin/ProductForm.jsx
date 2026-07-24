import React, { useState, useEffect } from 'react';

/**
 * ProductForm — Create/edit product form including SKU variant management.
 * Props:
 *   initialData  {object|null}   — product data for edit mode
 *   categories   {Array}         — [{ id, name }]
 *   brands       {Array}         — [{ id, name }]
 *   onSubmit     {function(formData): Promise<void>}
 *   onCancel     {function}
 */

const DEFAULT_SKU = { sku_code: '', attributes: '', price: '', stock: '' };

const ProductForm = ({ initialData = null, categories = [], brands = [], onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category_id: '',
    brand_id: '',
    is_active: true,
  });
  const [skus, setSkus] = useState([{ ...DEFAULT_SKU }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        category_id: initialData.category_id || '',
        brand_id: initialData.brand_id || '',
        is_active: initialData.is_active !== undefined ? initialData.is_active : true,
      });
      if (initialData.skus && initialData.skus.length > 0) {
        setSkus(
          initialData.skus.map((s) => ({
            sku_code: s.sku_code || '',
            attributes: s.attributes ? JSON.stringify(s.attributes) : '',
            price: s.price !== undefined ? String(s.price) : '',
            stock: s.stock !== undefined ? String(s.stock) : '',
          }))
        );
      }
    }
  }, [initialData]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSkuChange = (index, e) => {
    const { name, value } = e.target;
    setSkus((prev) =>
      prev.map((sku, i) => (i === index ? { ...sku, [name]: value } : sku))
    );
  };

  const addSku = () => setSkus((prev) => [...prev, { ...DEFAULT_SKU }]);

  const removeSku = (index) =>
    setSkus((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const parsedSkus = skus.map((s) => ({
        sku_code: s.sku_code,
        attributes: s.attributes ? JSON.parse(s.attributes) : {},
        price: parseFloat(s.price),
        stock: parseInt(s.stock, 10),
      }));
      await onSubmit({ ...form, skus: parsedSkus });
    } catch (err) {
      setError(err?.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="product-form admin-form" onSubmit={handleSubmit}>
      <h2 className="admin-form__title">
        {initialData ? 'Edit Product' : 'New Product'}
      </h2>

      {error && <p className="form-error">{error}</p>}

      <div className="admin-form__field">
        <label htmlFor="product-name">Name</label>
        <input
          id="product-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleFormChange}
          required
        />
      </div>

      <div className="admin-form__field">
        <label htmlFor="product-description">Description</label>
        <textarea
          id="product-description"
          name="description"
          rows={4}
          value={form.description}
          onChange={handleFormChange}
        />
      </div>

      <div className="admin-form__field">
        <label htmlFor="product-category">Category</label>
        <select
          id="product-category"
          name="category_id"
          value={form.category_id}
          onChange={handleFormChange}
          required
        >
          <option value="">Select category…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-form__field">
        <label htmlFor="product-brand">Brand</label>
        <select
          id="product-brand"
          name="brand_id"
          value={form.brand_id}
          onChange={handleFormChange}
        >
          <option value="">Select brand…</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-form__field admin-form__field--checkbox">
        <label>
          <input
            name="is_active"
            type="checkbox"
            checked={form.is_active}
            onChange={handleFormChange}
          />{' '}
          Active
        </label>
      </div>

      <div className="product-form__skus">
        <h3 className="product-form__skus-title">SKU Variants</h3>
        {skus.map((sku, index) => (
          <div key={index} className="product-form__sku-row">
            <div className="admin-form__field">
              <label htmlFor={`sku-code-${index}`}>SKU Code</label>
              <input
                id={`sku-code-${index}`}
                name="sku_code"
                type="text"
                value={sku.sku_code}
                onChange={(e) => handleSkuChange(index, e)}
                required
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor={`sku-attributes-${index}`}>
                Attributes (JSON)
              </label>
              <input
                id={`sku-attributes-${index}`}
                name="attributes"
                type="text"
                placeholder='e.g. {"color":"red","size":"M"}'
                value={sku.attributes}
                onChange={(e) => handleSkuChange(index, e)}
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor={`sku-price-${index}`}>Price</label>
              <input
                id={`sku-price-${index}`}
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={sku.price}
                onChange={(e) => handleSkuChange(index, e)}
                required
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor={`sku-stock-${index}`}>Stock</label>
              <input
                id={`sku-stock-${index}`}
                name="stock"
                type="number"
                min="0"
                value={sku.stock}
                onChange={(e) => handleSkuChange(index, e)}
                required
              />
            </div>
            {skus.length > 1 && (
              <button
                type="button"
                className="btn btn--danger btn--sm"
                onClick={() => removeSku(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="btn btn--secondary btn--sm"
          onClick={addSku}
        >
          + Add SKU
        </button>
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
          {loading ? 'Saving…' : initialData ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
