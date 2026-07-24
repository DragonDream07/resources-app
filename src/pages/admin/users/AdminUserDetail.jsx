import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const AVAILABLE_ROLES = ['admin', 'customer', 'guest'];

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: '32px 24px',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: '#4c6ef5',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#495057',
    marginTop: '4px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #868e96',
    padding: '24px',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '16px',
    marginTop: 0,
    paddingBottom: '12px',
    borderBottom: '1px solid #e9ecef',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '180px 1fr',
    gap: '8px',
    padding: '10px 0',
    borderBottom: '1px solid #f1f3f5',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  fieldValue: {
    fontSize: '14px',
    color: '#343a40',
  },
  fieldValueMono: {
    fontSize: '13px',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    color: '#343a40',
  },
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
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#343a40',
  },
  select: {
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1.5px solid #868e96',
    fontSize: '14px',
    color: '#212529',
    backgroundColor: '#ffffff',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    appearance: 'auto',
    cursor: 'pointer',
    maxWidth: '240px',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginTop: '4px',
  },
  primaryButton: (disabled) => ({
    padding: '10px 24px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: disabled ? '#e9ecef' : '#4c6ef5',
    color: disabled ? '#adb5bd' : '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    minHeight: '44px',
    transition: 'background-color 0.15s',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  }),
  successBanner: {
    backgroundColor: '#d3f9d8',
    color: '#2f9e44',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  loadingText: {
    textAlign: 'center',
    padding: '48px',
    color: '#495057',
    fontSize: '14px',
  },
  ordersTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  ordersThRow: {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #868e96',
  },
  ordersTh: {
    padding: '10px 12px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  ordersTd: {
    padding: '10px 12px',
    color: '#343a40',
    borderBottom: '1px solid #e9ecef',
  },
};

function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRole, setSelectedRole] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`/api/admin/users/${id}`, { credentials: 'include' }),
      fetch(`/api/admin/users/${id}/orders`, { credentials: 'include' }),
    ])
      .then(async ([userRes, ordersRes]) => {
        if (!userRes.ok) throw new Error('Failed to load user.');
        const userData = await userRes.json();
        const ordersData = ordersRes.ok ? await ordersRes.json() : [];
        setUser(userData);
        setSelectedRole(userData.role || '');
        setOrders(Array.isArray(ordersData) ? ordersData : ordersData.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleSaveRole = async () => {
    if (!selectedRole || selectedRole === user?.role) return;
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to update role.');
      }
      const updated = await res.json();
      setUser(updated);
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={styles.loadingText}>Loading user…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <Link to="/admin/users" style={styles.backLink}>
            ← Back to Users
          </Link>
          <div style={styles.errorBanner}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/admin/users" style={styles.backLink}>
          ← Back to Users
        </Link>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>{user?.name || user?.email || `User #${id}`}</h1>
            <p style={styles.subtitle}>User ID: {user?.id}</p>
          </div>
          {user?.role && <span style={styles.roleBadge(user.role)}>{user.role}</span>}
        </div>

        {/* User Details Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>User Details</h2>

          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>ID</span>
            <span style={styles.fieldValueMono}>{user?.id}</span>
          </div>
          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Name</span>
            <span style={styles.fieldValue}>{user?.name || '—'}</span>
          </div>
          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Email</span>
            <span style={styles.fieldValue}>{user?.email || '—'}</span>
          </div>
          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Phone</span>
            <span style={styles.fieldValue}>{user?.phone || '—'}</span>
          </div>
          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Role</span>
            <span style={styles.fieldValue}>
              <span style={styles.roleBadge(user?.role)}>{user?.role}</span>
            </span>
          </div>
          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Joined</span>
            <span style={styles.fieldValue}>
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                : '—'}
            </span>
          </div>
          <div style={{ ...styles.fieldRow, borderBottom: 'none' }}>
            <span style={styles.fieldLabel}>Last Login</span>
            <span style={styles.fieldValue}>
              {user?.last_login_at
                ? new Date(user.last_login_at).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                : '—'}
            </span>
          </div>
        </div>

        {/* Role Assignment Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Role Assignment</h2>

          {saveSuccess && (
            <div style={styles.successBanner}>
              Role updated successfully to <strong>{selectedRole}</strong>.
            </div>
          )}
          {saveError && <div style={styles.errorBanner}>{saveError}</div>}

          <div style={styles.formGroup}>
            <label htmlFor="role-select" style={styles.label}>
              Assign Role
            </label>
            <select
              id="role-select"
              value={selectedRole}
              onChange={handleRoleChange}
              style={styles.select}
              aria-label="Select user role"
            >
              <option value="" disabled>
                Select a role…
              </option>
              {AVAILABLE_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.buttonRow}>
            <button
              onClick={handleSaveRole}
              disabled={saving || !selectedRole || selectedRole === user?.role}
              style={styles.primaryButton(saving || !selectedRole || selectedRole === user?.role)}
            >
              {saving ? 'Saving…' : 'Save Role'}
            </button>
            {selectedRole === user?.role && (
              <span style={{ fontSize: '13px', color: '#495057' }}>Current role is already {user?.role}.</span>
            )}
          </div>
        </div>

        {/* Order History Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Order History</h2>
          {orders.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>No orders found for this user.</p>
          ) : (
            <table style={styles.ordersTable}>
              <thead>
                <tr style={styles.ordersThRow}>
                  <th style={styles.ordersTh}>Order ID</th>
                  <th style={styles.ordersTh}>Date</th>
                  <th style={styles.ordersTh}>Status</th>
                  <th style={styles.ordersTh}>Total</th>
                  <th style={styles.ordersTh}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ ...styles.ordersTd, fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", fontSize: '12px' }}>
                      {order.id}
                    </td>
                    <td style={styles.ordersTd}>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td style={styles.ordersTd}>{order.status || '—'}</td>
                    <td style={styles.ordersTd}>
                      {order.total != null
                        ? `₹${Number(order.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                        : '—'}
                    </td>
                    <td style={styles.ordersTd}>
                      <Link
                        to={`/admin/orders/${order.id}`}
                        style={{ color: '#4c6ef5', textDecoration: 'none', fontWeight: '500', fontSize: '13px' }}
                      >
                        View
                      </Link>
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

export default AdminUserDetail;
