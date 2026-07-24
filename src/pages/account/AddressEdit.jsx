import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    margin: '0 0 8px 0',
    color: '#212529',
  },
  breadcrumb: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '6px',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    padding: '12px 24px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #868e96',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    marginRight: '12px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  successBanner: {
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
};

export default function AddressEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    fetch(`/users/me/addresses/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setForm({
          full_name: data.full_name || data.name || '',
          phone: data.phone || '',
          line1: data.line1 || '',
          line2: data.line2 || '',
          city: data.city || '',
          state: data.state || '',
          postal_code: data.postal_code || '',
          country: data.country || '',
        });
      })
      .catch(() => setError('Failed to load address.'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSaving(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`/users/me/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || 'Failed to update address.');
        return;
      }
      setSuccessMsg('Address updated successfully.');
      setTimeout(() => navigate('/account/addresses'), 1200);
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ height: '200px', backgroundColor: '#ffffff', borderRadius: '10px' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <Link to="/account" style={{ color: '#4c6ef5', textDecoration: 'none' }}>My Account</Link>
          {' › '}
          <Link to="/account/addresses" style={{ color: '#4c6ef5', textDecoration: 'none' }}>Addresses</Link>
          {' › '}
          <span>Edit Address</span>
        </div>
        <h1 style={styles.pageTitle}>Edit address</h1>

        <div style={styles.card}>
          {error && <div style={styles.errorBanner}>{error}</div>}
          {successMsg && <div style={styles.successBanner}>{successMsg}</div>}
          <form onSubmit={handleSubmit}>
            <div style={styles.fieldGroup}>
              <label htmlFor="full_name" style={styles.label}>Full name</label>
              <input id="full_name" type="text" style={styles.input} value={form.full_name} onChange={handleChange('full_name')} required />
            </div>
            <div style={styles.fieldGroup}>
              <label htmlFor="phone" style={styles.label}>Phone number</label>
              <input id="phone" type="tel" style={styles.input} value={form.phone} onChange={handleChange('phone')} />
            </div>
            <div style={styles.fieldGroup}>
              <label htmlFor="line1" style={styles.label}>Address line 1</label>
              <input id="line1" type="text" style={styles.input} value={form.line1} onChange={handleChange('line1')} required />
            </div>
            <div style={styles.fieldGroup}>
              <label htmlFor="line2" style={styles.label}>Address line 2 <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <input id="line2" type="text" style={styles.input} value={form.line2} onChange={handleChange('line2')} />
            </div>
            <div style={{ ...styles.row, flexWrap: 'wrap' }}>
              <div style={{ ...styles.fieldGroup, flex: 1, minWidth: '140px' }}>
                <label htmlFor="city" style={styles.label}>City</label>
                <input id="city" type="text" style={styles.input} value={form.city} onChange={handleChange('city')} required />
              </div>
              <div style={{ ...styles.fieldGroup, flex: 1, minWidth: '120px' }}>
                <label htmlFor="state" style={styles.label}>State / Province</label>
                <input id="state" type="text" style={styles.input} value={form.state} onChange={handleChange('state')} required />
              </div>
              <div style={{ ...styles.fieldGroup, flex: 1, minWidth: '100px' }}>
                <label htmlFor="postal_code" style={styles.label}>Postal code</label>
                <input id="postal_code" type="text" style={styles.input} value={form.postal_code} onChange={handleChange('postal_code')} required />
              </div>
            </div>
            <div style={styles.fieldGroup}>
              <label htmlFor="country" style={styles.label}>Country</label>
              <input id="country" type="text" style={styles.input} value={form.country} onChange={handleChange('country')} required />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" style={styles.btnGhost} onClick={() => navigate('/account/addresses')}>
                Cancel
              </button>
              <button type="submit" style={styles.btnPrimary} disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
