import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = {
  page: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", color: '#212529' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: '700', lineHeight: '32px', letterSpacing: '-0.01em', margin: 0 },
  btn: { display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#4c6ef5', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none', minHeight: '44px' },
  btnDanger: { backgroundColor: '#f03e3e', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '14px', cursor: 'pointer', minHeight: '44px' },
  btnSecondary: { backgroundColor: '#ffffff', color: '#4c6ef5', border: '1px solid #4c6ef5', borderRadius: '6px', padding: '6px 12px', fontSize: '14px', cursor: 'pointer', minHeight: '44px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' },
  card: { backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #868e96', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#495057', borderBottom: '1px solid #868e96', backgroundColor: '#f8f9fa' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#212529', borderBottom: '1px solid #e9ecef' },
  actions: { display: 'flex', gap: '8px' },
  error: { backgroundColor: '#ffe3e3', color: '#f03e3e', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px' },
  empty: { textAlign: 'center', padding: '48px', color: '#495057' },
  indent: { paddingLeft: '24px' },
};

function CategoryRow({ category, depth, onDelete }) {
  return (
    <>
      <tr>
        <td style={{ ...styles.td, paddingLeft: (16 + depth * 24) + 'px' }}>{category.name}</td>
        <td style={styles.td}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>{category.slug}</span></td>
        <td style={styles.td}>{category.parentId || '—'}</td>
        <td style={styles.td}>
          <div style={styles.actions}>
            <Link to={'/admin/catalogue/categories/' + category.id + '/edit'} style={styles.btnSecondary}>Edit</Link>
            <button style={styles.btnDanger} onClick={() => onDelete(category.id)}>Delete</button>
          </div>
        </td>
      </tr>
      {category.children && category.children.map(child => (
        <CategoryRow key={child.id} category={child} depth={depth + 1} onDelete={onDelete} />
      ))}
    </>
  );
}

export default function AdminCategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    fetch('/categories')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setCategories(data.categories || data || []); setLoading(false); })
      .catch(() => { setError('Could not load categories.'); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (categoryId) => {
    if (!window.confirm('Delete this category?')) return;
    fetch('/categories/' + categoryId, { method: 'DELETE' })
      .then(r => r.ok ? load() : Promise.reject())
      .catch(() => setError('Could not delete category.'));
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Categories</h1>
          <Link to="/admin/catalogue/categories/new" style={styles.btn}>+ New Category</Link>
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.card}>
          {loading ? (
            <div style={styles.empty}>Loading...</div>
          ) : categories.length === 0 ? (
            <div style={styles.empty}>No categories found.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Slug</th>
                  <th style={styles.th}>Parent ID</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <CategoryRow key={cat.id} category={cat} depth={0} onDelete={handleDelete} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
