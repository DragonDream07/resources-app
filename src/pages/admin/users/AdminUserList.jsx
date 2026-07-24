import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ROLES = ['all', 'admin', 'customer', 'guest'];

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: '32px 24px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    margin: 0,
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
  },
  filterButton: (active) => ({
    padding: '6px 16px',
    borderRadius: '9999px',
    border: active ? '1.5px solid #4c6ef5' : '1.5px solid #868e96',
    backgroundColor: active ? '#e8ecfd' : '#ffffff',
    color: active ? '#3b5bdb' : '#343a40',
    fontSize: '14px',
    fontWeight: active ? '600' : '400',
    cursor: 'pointer',
    transition: 'all 0.15s',
    minHeight: '44px',
  }),
  searchInput: {
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1.5px solid #868e96',
    fontSize: '14px',
    color: '#212529',
    backgroundColor: '#ffffff',
    minWidth: '240px',
    minHeight: '44px',
    outline: 'none',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #868e96',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #868e96',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    lineHeight: '16px',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#343a40',
    borderBottom: '1px solid #e9ecef',
    verticalAlign: 'middle',
  },
  tr: (index) => ({
    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
  }),
  roleBadge: (role) => {
    const map = {
      admin: { bg: '#e8ecfd', color: '#3b5bdb' },
      customer: { bg: '#d3f9d8', color: '#2f9e44' },
      guest: { bg: '#f8f9fa', color: '#495057' },
    };
    const theme = map[role] || { bg: '#e9ecef', color: '#495057' };
    return {
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '9999px',
      backgroundColor: theme.bg,
      color: theme.color,
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      lineHeight: '16px',
    };
  },
  link: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontWeight: '500',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#495057',
    fontSize: '14px',
  },
  emptyImage: {
    width: '80px',
    marginBottom: '16px',
    opacity: 0.5,
  },
  loadingRow: {
    textAlign: 'center',
    padding: '32px',
    color: '#495057',
    fontSize: '14px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
};

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (roleFilter !== 'all') params.set('role', roleFilter);
    if (search.trim()) params.set('q', search.trim());
    fetch(`/api/admin/users?${params.toString()}`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load users.');
        return res.json();
      })
      .then((data) => {
        setUsers(Array.isArray(data) ? data : data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [roleFilter, search]);

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return (
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.id && String(u.id).toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Users</h1>
        </div>

        <div style={styles.filterBar}>
          <span style={styles.filterLabel}>Filter by role:</span>
          {ROLES.map((role) => (
            <button
              key={role}
              style={styles.filterButton(roleFilter === role)}
              onClick={() => setRoleFilter(role)}
              aria-pressed={roleFilter === role}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
            aria-label="Search users"
          />
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <div style={styles.card}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Joined</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={styles.loadingRow}>
                    Loading users…
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div style={styles.emptyState}>
                      <img
                        src="/src/assets/images/empty-state.svg"
                        alt="No users"
                        style={styles.emptyImage}
                      />
                      <p>No users found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} style={styles.tr(index)}>
                    <td style={{ ...styles.td, fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", fontSize: '12px' }}>
                      {user.id}
                    </td>
                    <td style={styles.td}>{user.name || '—'}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      <span style={styles.roleBadge(user.role)}>{user.role}</span>
                    </td>
                    <td style={{ ...styles.td, color: '#495057' }}>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td style={styles.td}>
                      <Link to={`/admin/users/${user.id}`} style={styles.link}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUserList;
