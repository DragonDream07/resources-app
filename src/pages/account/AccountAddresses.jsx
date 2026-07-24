import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '16px',
    position: 'relative',
  },
  addressName: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
  },
  addressText: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    margin: '0 0 12px 0',
  },
  actionRow: {
    display: 'flex',
    gap: '12px',
  },
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '44px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #868e96',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  btnDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '44px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#f03e3e',
    border: '1px solid #f03e3e',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '44px',
    padding: '12px 20px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    textDecoration: 'none',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
};

export default function AccountAddresses() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const loadAddresses = () => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    setLoading(true);
    fetch('/users/me/addresses', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setAddresses(Array.isArray(data) ? data : (data.items || []));
      })
      .catch(() => setError('Failed to load addresses. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAddresses(); }, []);

  const handleDelete = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;
    setDeleteError(null);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`/users/me/addresses/${addressId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setAddresses(prev => prev.filter(a => a.id !== addressId));
    } catch {
      setDeleteError('Failed to delete address. Please try again.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <Link to="/account" style={{ color: '#4c6ef5', textDecoration: 'none' }}>My Account</Link>
          {' › '}
          <span>Addresses</span>
        </div>
        <div style={styles.headerRow}>
          <h1 style={{ ...styles.pageTitle, margin: 0 }}>Saved addresses</h1>
          <Link to="/account/addresses/new" style={styles.btnPrimary}>+ Add address</Link>
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}
        {deleteError && <div style={styles.errorBanner}>{deleteError}</div>}

        {loading ? (
          <div>
            {[1, 2].map(i => (
              <div key={i} style={{ ...styles.card }}>
                <div style={{ height: '16px', width: '140px', backgroundColor: '#e9ecef', borderRadius: '6px', marginBottom: '8px' }} />
                <div style={{ height: '14px', width: '260px', backgroundColor: '#e9ecef', borderRadius: '6px', marginBottom: '4px' }} />
                <div style={{ height: '14px', width: '180px', backgroundColor: '#e9ecef', borderRadius: '6px' }} />
              </div>
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div style={styles.emptyState}>
            <img src="/src/assets/images/empty-state.svg" alt="" style={{ width: '80px', marginBottom: '16px', opacity: 0.5 }} />
            <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>No addresses saved yet</p>
            <p style={{ fontSize: '14px', color: '#495057', margin: '0 0 20px 0' }}>Add an address for faster checkout.</p>
            <Link to="/account/addresses/new" style={styles.btnPrimary}>Add your first address</Link>
          </div>
        ) : (
          <div>
            {addresses.map(addr => (
              <div key={addr.id} style={styles.card}>
                <p style={styles.addressName}>{addr.full_name || addr.name}</p>
                <p style={styles.addressText}>
                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                  {addr.city}, {addr.state} {addr.postal_code}<br />
                  {addr.country}
                </p>
                {addr.phone && <p style={{ ...styles.addressText, marginBottom: '12px' }}>{addr.phone}</p>}
                <div style={styles.actionRow}>
                  <button
                    style={styles.btnGhost}
                    onClick={() => navigate(`/account/addresses/${addr.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.btnDanger}
                    onClick={() => handleDelete(addr.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
