import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const styles = {
  page: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", color: '#212529' },
  container: { maxWidth: '600px', margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: '24px', fontWeight: '700', lineHeight: '32px', letterSpacing: '-0.01em', marginBottom: '24px' },
  card: { backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #868e96', padding: '24px' },
  field: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#495057', marginBottom: '6px' },
  input: { width: '100%', boxSizing: 'border-box', border: '1px solid #868e96', borderRadius: '6px', padding: '10px 12px', fontSize: '16px', fontFamily: "'Inter', sans-serif", backgroundColor: '#ffffff', color: '#212529' },
  inputError: { borderColor: '#f03e3e' },
  textarea: { width: '100%', boxSizing: 'border-box', border: '1px solid #868e96', borderRadius: '6px', padding: '10px 12px', fontSize: '16px', fontFamily: "'Inter', sans-serif", backgroundColor: '#ffffff', color: '#212529', minHeight: '80px', resize: 'vertical' },
  errorBanner: { backgroundColor: '#ffe3e3', color: '#f03e3e', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px' },
  successBanner: { backgroundColor: '#d3f9d8', color: '#37b24d', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px' },
  fieldError: { color: '#f03e3e', fontSize: '12px', marginTop: '4px' },
  actions: { display: 'flex', gap: '12px', marginTop: '24px' },
  btn: { backgroundColor: '#4c6ef5', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', minHeight: '44px' },
  btnSecondary: { backgroundColor: '#ffffff', color: '#4c6ef5', border: '1px solid #4c6ef5', borderRadius: '10px', padding: '10px 24px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', minHeight: '44px' },
};

export default function AdminBrandEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', slug: '', description: '', website: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(location.state?.toast || null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/brands/' + id)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setForm({ name: data.name || '', slug: data.slug || '', description: data.description || '', website: data.website || '' });
        setLoading(false);
      })
      .catch(() => { setSubmitError('Could not load brand.'); setLoading(false); });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setFieldErrors(fe => ({ ...fe, [name]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setSubmitting(true); setSubmitError(null);
    fetch('/brands/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, slug: form.slug || undefined, description: form.description || undefined, website: form.website || undefined }),
    })
      .then(r => r.ok ? r.json() : r.json().then(d => Promise.reject(d)))
      .then(() => { setSuccessMsg('Brand saved successfully.'); setSubmitting(false); })
      .catch(err => { setSubmitError('Brand could not be saved.'); setSubmitting(false); if (err && err.fieldErrors) setFieldErrors(err.fieldErrors); });
  };

  if (loading) return <div style={styles.page}><div style={styles.container}><p>Loading...</p></div></div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Edit Brand</h1>
        {submitError && <div style={styles.errorBanner}>{submitError}</div>}
        {successMsg && <div style={styles.successBanner}>{successMsg}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.card}>
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
            <div style={styles.field}>
              <label style={styles.label}>Website</label>
              <input style={styles.input} name="website" type="url" value={form.website} onChange={handleChange} placeholder="https://" />
            </div>
          </div>
          <div style={styles.actions}>
            <button type="submit" style={styles.btn} disabled={submitting}>{submitting ? 'Saving...' : 'Save Brand'}</button>
            <button type="button" style={styles.btnSecondary} onClick={() => navigate('/admin/catalogue/brands')}>Back to List</button>
          </div>
        </form>
      </div>
    </div>
  );
}
