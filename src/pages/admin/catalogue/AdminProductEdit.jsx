import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const styles = {
  page: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", color: '#212529' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: '24px', fontWeight: '700', lineHeight: '32px', letterSpacing: '-0.01em', marginBottom: '24px' },
  card: { backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #868e96', padding: '24px', marginBottom: '24px' },
  sectionTitle: { fontSize: '20px', fontWeight: '600', lineHeight: '28px', marginBottom: '16px', marginTop: 0 },
  field: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#495057', marginBottom: '6px' },
  input: { width: '100%', boxSizing: 'border-box', border: '1px solid #868e96', borderRadius: '6px', padding: '10px 12px', fontSize: '16px', fontFamily: "'Inter', sans-serif", backgroundColor: '#ffffff', color: '#212529' },
  inputError: { borderColor: '#f03e3e' },
  select: { width: '100%', boxSizing: 'border-box', border: '1px solid #868e96', borderRadius: '6px', padding: '10px 12px', fontSize: '16px', fontFamily: "'Inter', sans-serif", backgroundColor: '#ffffff', color: '#212529' },
  textarea: { width: '100%', boxSizing: 'border-box', border: '1px solid #868e96', borderRadius: '6px', padding: '10px 12px', fontSize: '16px', fontFamily: "'Inter', sans-serif", backgroundColor: '#ffffff', color: '#212529', minHeight: '100px', resize: 'vertical' },
  errorBanner: { backgroundColor: '#ffe3e3', color: '#f03e3e', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px' },
  successBanner: { backgroundColor: '#d3f9d8', color: '#37b24d', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px' },
  fieldError: { color: '#f03e3e', fontSize: '12px', marginTop: '4px' },
  actions: { display: 'flex', gap: '12px', marginTop: '24px' },
  btn: { backgroundColor: '#4c6ef5', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', minHeight: '44px' },
  btnSecondary: { backgroundColor: '#ffffff', color: '#4c6ef5', border: '1px solid #4c6ef5', borderRadius: '10px', padding: '10px 24px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', minHeight: '44px' },
  btnSmall: { backgroundColor: '#4c6ef5', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', minHeight: '36px' },
  btnDanger: { backgroundColor: '#f03e3e', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '14px', cursor: 'pointer', minHeight: '36px' },
  retryLink: { color: '#4c6ef5', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  skuRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '12px', alignItems: 'end', marginBottom: '12px' },
  skuLabel: { fontSize: '11px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#495057', marginBottom: '4px', display: 'block' },
  skuInput: { width: '100%', boxSizing: 'border-box', border: '1px solid #868e96', borderRadius: '6px', padding: '8px 10px', fontSize: '14px', fontFamily: "'Inter', sans-serif" },
  addSkuBtn: { backgroundColor: 'transparent', color: '#4c6ef5', border: '1px dashed #4c6ef5', borderRadius: '6px', padding: '8px 16px', fontSize: '14px', cursor: 'pointer', width: '100%', marginTop: '8px' },
};

function SkuRow({ sku, index, onChange, onSave, onDelete }) {
  return (
    <div style={styles.skuRow}>
      <div>
        <span style={styles.skuLabel}>SKU Code</span>
        <input style={{ ...styles.skuInput, fontFamily: "'JetBrains Mono', monospace" }} value={sku.code || ''} onChange={e => onChange(index, 'code', e.target.value)} />
      </div>
      <div>
        <span style={styles.skuLabel}>Size</span>
        <input style={styles.skuInput} value={sku.size || ''} onChange={e => onChange(index, 'size', e.target.value)} />
      </div>
      <div>
        <span style={styles.skuLabel}>Colour</span>
        <input style={styles.skuInput} value={sku.colour || ''} onChange={e => onChange(index, 'colour', e.target.value)} />
      </div>
      <div>
        <span style={styles.skuLabel}>Stock</span>
        <input style={styles.skuInput} type="number" value={sku.stock ?? ''} onChange={e => onChange(index, 'stock', e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: '6px', paddingBottom: '0' }}>
        <button style={styles.btnSmall} onClick={() => onSave(index)}>Save</button>
        <button style={styles.btnDanger} onClick={() => onDelete(index)}>Del</button>
      </div>
    </div>
  );
}

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', slug: '', description: '', basePrice: '', taxRate: '', brandId: '', categoryId: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(location.state?.toast || null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brandsError, setBrandsError] = useState(false);
  const [categoriesError, setCategoriesError] = useState(false);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [skus, setSkus] = useState([]);
  const [skusLoading, setSkusLoading] = useState(true);

  const loadBrands = () => {
    setBrandsLoading(true); setBrandsError(false);
    fetch('/brands').then(r => r.ok ? r.json() : Promise.reject()).then(d => { setBrands(d.brands || d || []); setBrandsLoading(false); }).catch(() => { setBrandsError(true); setBrandsLoading(false); });
  };
  const loadCategories = () => {
    setCategoriesLoading(true); setCategoriesError(false);
    fetch('/categories').then(r => r.ok ? r.json() : Promise.reject()).then(d => { setCategories(d.categories || d || []); setCategoriesLoading(false); }).catch(() => { setCategoriesError(true); setCategoriesLoading(false); });
  };

  useEffect(() => {
    loadBrands();
    loadCategories();
    fetch('/products/' + id)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setForm({ name: data.name || '', slug: data.slug || '', description: data.description || '', basePrice: data.basePrice != null ? String(data.basePrice) : '', taxRate: data.taxRate != null ? String(data.taxRate) : '', brandId: data.brandId || data.brand?.id || '', categoryId: data.categoryId || data.category?.id || '' });
        setLoading(false);
      })
      .catch(() => { setSubmitError('Could not load product.'); setLoading(false); });
    fetch('/products/' + id + '/skus')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setSkus(d.skus || d || []); setSkusLoading(false); })
      .catch(() => setSkusLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setFieldErrors(fe => ({ ...fe, [name]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.basePrice) errs.basePrice = 'Base price is required.';
    if (form.taxRate === '' || form.taxRate == null) errs.taxRate = 'Tax rate is required.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setSubmitting(true); setSubmitError(null);
    fetch('/products/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, slug: form.slug || undefined, description: form.description || undefined, basePrice: parseFloat(form.basePrice), taxRate: parseFloat(form.taxRate), brandId: form.brandId || undefined, categoryId: form.categoryId || undefined }),
    })
      .then(r => r.ok ? r.json() : r.json().then(d => Promise.reject(d)))
      .then(() => { setSuccessMsg('Product saved successfully.'); setSubmitting(false); })
      .catch(err => { setSubmitError('Product could not be saved.'); setSubmitting(false); if (err && err.fieldErrors) setFieldErrors(err.fieldErrors); });
  };

  const handleSkuChange = (index, field, value) => {
    setSkus(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const handleSkuSave = (index) => {
    const sku = skus[index];
    const isNew = !sku.id;
    const url = isNew ? '/products/' + id + '/skus' : '/products/' + id + '/skus/' + sku.id;
    const method = isNew ? 'POST' : 'PUT';
    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: sku.code, size: sku.size, colour: sku.colour, stock: parseInt(sku.stock) || 0 }) })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(saved => { setSkus(prev => prev.map((s, i) => i === index ? saved : s)); })
      .catch(() => setSubmitError('Could not save SKU.'));
  };

  const handleSkuDelete = (index) => {
    const sku = skus[index];
    if (!sku.id) { setSkus(prev => prev.filter((_, i) => i !== index)); return; }
    if (!window.confirm('Delete this SKU?')) return;
    setSkus(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSku = () => {
    setSkus(prev => [...prev, { code: '', size: '', colour: '', stock: 0 }]);
  };

  if (loading) return <div style={styles.page}><div style={styles.container}><p>Loading...</p></div></div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Edit Product</h1>
        {submitError && <div style={styles.errorBanner}>{submitError}</div>}
        {successMsg && <div style={styles.successBanner}>{successMsg}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Product Details</h2>
            <div style={styles.field}>
              <label style={styles.label}>Name *</label>
              <input style={{ ...styles.input, ...(fieldErrors.name ? styles.inputError : {}) }} name="name" value={form.name} onChange={handleChange} />
              {fieldErrors.name && <div style={styles.fieldError}>{fieldErrors.name}</div>}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Slug</label>
              <input style={styles.input} name="slug" value={form.slug} onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea style={styles.textarea} name="description" value={form.description} onChange={handleChange} />
            </div>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Base Price *</label>
                <input style={{ ...styles.input, ...(fieldErrors.basePrice ? styles.inputError : {}) }} name="basePrice" type="number" step="0.01" value={form.basePrice} onChange={handleChange} />
                {fieldErrors.basePrice && <div style={styles.fieldError}>{fieldErrors.basePrice}</div>}
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Tax Rate *</label>
                <input style={{ ...styles.input, ...(fieldErrors.taxRate ? styles.inputError : {}) }} name="taxRate" type="number" step="0.01" value={form.taxRate} onChange={handleChange} />
                {fieldErrors.taxRate && <div style={styles.fieldError}>{fieldErrors.taxRate}</div>}
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Brand</label>
                {brandsLoading ? (
                  <select style={{ ...styles.select, backgroundColor: '#e9ecef', color: '#adb5bd' }} disabled><option>Loading...</option></select>
                ) : brandsError ? (
                  <div><span style={styles.retryLink} onClick={loadBrands}>Could not load options — retry</span></div>
                ) : (
                  <select style={styles.select} name="brandId" value={form.brandId} onChange={handleChange}>
                    <option value="">— Select brand —</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                )}
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Category</label>
                {categoriesLoading ? (
                  <select style={{ ...styles.select, backgroundColor: '#e9ecef', color: '#adb5bd' }} disabled><option>Loading...</option></select>
                ) : categoriesError ? (
                  <div><span style={styles.retryLink} onClick={loadCategories}>Could not load options — retry</span></div>
                ) : (
                  <select style={styles.select} name="categoryId" value={form.categoryId} onChange={handleChange}>
                    <option value="">— Select category —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}
              </div>
            </div>
          </div>
          <div style={styles.actions}>
            <button type="submit" style={styles.btn} disabled={submitting}>{submitting ? 'Saving...' : 'Save Product'}</button>
            <button type="button" style={styles.btnSecondary} onClick={() => navigate('/admin/catalogue/products')}>Back to List</button>
          </div>
        </form>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>SKUs</h2>
          {skusLoading ? <p>Loading SKUs...</p> : (
            <>
              {skus.map((sku, i) => (
                <SkuRow key={sku.id || 'new-' + i} sku={sku} index={i} onChange={handleSkuChange} onSave={handleSkuSave} onDelete={handleSkuDelete} />
              ))}
              <button type="button" style={styles.addSkuBtn} onClick={handleAddSku}>+ Add SKU</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
