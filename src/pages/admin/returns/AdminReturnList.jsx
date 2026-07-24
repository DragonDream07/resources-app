import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  pending: { bg: '#fff4e6', color: '#fd7e14' },
  approved: { bg: '#d3f9d8', color: '#37b24d' },
  rejected: { bg: '#ffe3e3', color: '#f03e3e' },
  completed: { bg: '#e8ecfd', color: '#4c6ef5' },
};

function StatusBadge({ status }) {
  const style = STATUS_COLORS[status] || { bg: '#e9ecef', color: '#495057' };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '9999px',
        backgroundColor: style.bg,
        color: style.color,
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {status}
    </span>
  );
}

export default function AdminReturnList() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    params.set('page', page);
    fetch(`/return-requests?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load return requests.');
        return res.json();
      })
      .then((data) => {
        setReturns(data.items || data || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [statusFilter, page]);

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      color: '#212529',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px',
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
      letterSpacing: '-0.01em',
      lineHeight: '32px',
      color: '#212529',
      margin: 0,
    },
    filterRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
    },
    select: {
      padding: '8px 12px',
      borderRadius: '6px',
      border: '1px solid #868e96',
      fontSize: '14px',
      color: '#212529',
      backgroundColor: '#ffffff',
      minHeight: '44px',
      cursor: 'pointer',
      outline: 'none',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#495057',
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
    th: {
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#495057',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #868e96',
    },
    td: {
      padding: '14px 16px',
      fontSize: '14px',
      color: '#343a40',
      borderBottom: '1px solid #e9ecef',
      verticalAlign: 'middle',
    },
    trHover: {
      backgroundColor: '#f8f9fa',
    },
    link: {
      color: '#4c6ef5',
      textDecoration: 'none',
      fontWeight: '500',
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontSize: '14px',
    },
    errorBox: {
      backgroundColor: '#ffe3e3',
      color: '#f03e3e',
      borderRadius: '6px',
      padding: '12px 16px',
      fontSize: '14px',
      marginBottom: '16px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px 24px',
      color: '#495057',
      fontSize: '16px',
    },
    pagination: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '24px',
    },
    pageBtn: {
      minWidth: '44px',
      minHeight: '44px',
      padding: '0 12px',
      borderRadius: '6px',
      border: '1px solid #868e96',
      backgroundColor: '#ffffff',
      color: '#212529',
      fontSize: '14px',
      cursor: 'pointer',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    pageBtnActive: {
      backgroundColor: '#4c6ef5',
      color: '#ffffff',
      borderColor: '#4c6ef5',
      fontWeight: '600',
    },
    pageBtnDisabled: {
      backgroundColor: '#e9ecef',
      color: '#adb5bd',
      borderColor: '#e9ecef',
      cursor: 'not-allowed',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Return Requests</h1>
        </div>

        <div style={styles.filterRow}>
          <label htmlFor="status-filter" style={styles.label}>
            Status:
          </label>
          <select
            id="status-filter"
            style={styles.select}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.card}>
          {loading ? (
            <div style={styles.emptyState}>Loading return requests…</div>
          ) : returns.length === 0 ? (
            <div style={styles.emptyState}>No return requests found.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Request ID</th>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Submitted</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {returns.map((req) => (
                  <tr
                    key={req.id}
                    style={{}}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
                  >
                    <td style={styles.td}>
                      <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", fontSize: '13px' }}>
                        {req.id}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", fontSize: '13px' }}>
                        {req.orderId}
                      </span>
                    </td>
                    <td style={styles.td}>{req.customerName || req.customer?.name || '—'}</td>
                    <td style={styles.td}>
                      <span style={{ display: 'block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {req.reason || '—'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <StatusBadge status={req.status} />
                    </td>
                    <td style={styles.td}>
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td style={styles.td}>
                      <Link to={`/admin/returns/${req.id}`} style={styles.link}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={{ ...styles.pageBtn, ...(page <= 1 ? styles.pageBtnDisabled : {}) }}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              &lsaquo;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                style={{ ...styles.pageBtn, ...(p === page ? styles.pageBtnActive : {}) }}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              style={{ ...styles.pageBtn, ...(page >= totalPages ? styles.pageBtnDisabled : {}) }}
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              &rsaquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
