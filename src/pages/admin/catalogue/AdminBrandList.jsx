import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const styles = {
  page: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", color: '#212529' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: '700', lineHeight: '32px', letterSpacing: '-0.01em', margin: 0 },
  btn: { display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#4c6ef5', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none', minHeight: '44px' },
  btnSecondary: { backgroundColor: '#ffffff', color: '#4c6ef5', border: '1px solid #4c6ef5', borderRadius: '6px', padding: '6px 12px', fontSize: '14px', cursor: 'pointer', minHeight: '44px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' },
  card: { backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #868e96', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#495057', borderBottom: '1px solid #868e96', backgroundColor: '#f8f9fa' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#212529', borderBottom: '1px solid #e9ecef' },
  actions: { display: 'flex', gap: '8px' },
  error: { backgroundColor: '#ffe3e3', color: '#f03e3e', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px' },
  empty: { textAlign: 'center', padding: '48px', color: '#495057' },
};

export default function AdminBrandList() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/brands')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setBrands(data.brands || data || []); setLoading(false); })
      .catch(() => { setError('Could not load brands.'); setLoading(false); });
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Brands</h1>
          <Link to="/admin/catalogue/brands/new" style={styles.btn}>+ New Brand</Link>
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.card}>
          {loading ? (
            <div style={styles.empty}>Loading...</div>
          ) : brands.length === 0 ? (
            <div style={styles.empty}>No brands found.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Slug</th>
                  <th style={styles.th}>Website</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.map(b => (
                  <tr key={b.id}>
                    <td style={styles.td}>{b.name}</td>
                    <td style={styles.td}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>{b.slug}</span></td>
                    <td style={styles.td}>{b.website ? <a href={b.website} target="_blank" rel="noreferrer" style={{ color: '#4c6ef5' }}>{b.website}</a> : '—'}</td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <Link to={'/admin/catalogue/brands/' + b.id + '/edit'} style={styles.btnSecondary}>Edit</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
