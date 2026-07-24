import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const STATUS_OPTIONS = [
  { value: '', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'return_requested', label: 'Return Requested' },
  { value: 'returned', label: 'Returned' },
];

const STATUS_COLORS = {
  pending: { bg: '#fff4e6', color: '#fd7e14' },
  confirmed: { bg: '#e8ecfd', color: '#4c6ef5' },
  processing: { bg: '#e8ecfd', color: '#4c6ef5' },
  shipped: { bg: '#e8ecfd', color: '#4c6ef5' },
  delivered: { bg: '#d3f9d8', color: '#37b24d' },
  cancelled: { bg: '#ffe3e3', color: '#f03e3e' },
  return_requested: { bg: '#fff4e6', color: '#fd7e14' },
  returned: { bg: '#e9ecef', color: '#495057' },
};

function StatusBadge({ status }) {
  const style = STATUS_COLORS[status] || { bg: '#e9ecef', color: '#495057' };
  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: style.bg,
        color: style.color,
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        lineHeight: '16px',
        padding: '4px 10px',
        borderRadius: '9999px',
        whiteSpace: 'nowrap',
      }}
    >
      {status ? status.replace(/_/g, ' ') : '—'}
    </span>
  );
}

export default function AdminOrderList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (search) params.set('q', search);
      params.set('page', String(page));
      params.set('limit', '20');
      const token = localStorage.getItem('token');
      const res = await fetch(`/orders?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      setOrders(data.items || data.orders || data.results || data || []);
      setTotalPages(data.total_pages || data.totalPages || 1);
      setTotalCount(data.total || data.count || 0);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [status, search, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const params = {};
    if (status) params.status = status;
    if (search) params.q = search;
    if (page > 1) params.page = String(page);
    setSearchParams(params, { replace: true });
  }, [status, search, page, setSearchParams]);

  function handleStatusChange(val) {
    setStatus(val);
    setPage(1);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        color: '#212529',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '700',
                lineHeight: '32px',
                letterSpacing: '-0.01em',
                margin: 0,
                color: '#212529',
              }}
            >
              Orders
            </h1>
            {!loading && totalCount > 0 && (
              <p
                style={{
                  fontSize: '14px',
                  color: '#495057',
                  margin: '4px 0 0',
                }}
              >
                {totalCount} order{totalCount !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
          <Link
            to="/admin"
            style={{
              fontSize: '14px',
              color: '#4c6ef5',
              textDecoration: 'none',
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Filters */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '20px 24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'flex-end',
          }}
        >
          {/* Search */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: '1 1 260px' }}>
            <div style={{ flex: 1 }}>
              <label
                htmlFor="order-search"
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#495057',
                  marginBottom: '6px',
                }}
              >
                Search
              </label>
              <input
                id="order-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Order ID or customer name"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '14px',
                  border: '1px solid #868e96',
                  borderRadius: '6px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#212529',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                alignSelf: 'flex-end',
                padding: '10px 20px',
                backgroundColor: '#4c6ef5',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              Search
            </button>
          </form>

          {/* Status Filter */}
          <div style={{ flex: '0 1 220px' }}>
            <label
              htmlFor="status-filter"
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#495057',
                marginBottom: '6px',
              }}
            >
              Status
            </label>
            <select
              id="status-filter"
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #868e96',
                borderRadius: '6px',
                outline: 'none',
                color: '#212529',
                backgroundColor: '#ffffff',
                minHeight: '44px',
                cursor: 'pointer',
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Pill Tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '20px',
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatusChange(opt.value)}
              style={{
                padding: '6px 16px',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: status === opt.value ? '#4c6ef5' : '#868e96',
                backgroundColor: status === opt.value ? '#e8ecfd' : '#ffffff',
                color: status === opt.value ? '#4c6ef5' : '#495057',
                fontSize: '13px',
                fontWeight: status === opt.value ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                minHeight: '36px',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: '#ffe3e3',
              color: '#f03e3e',
              borderRadius: '6px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '64px 24px',
              textAlign: 'center',
              color: '#495057',
              fontSize: '16px',
              boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
            }}
          >
            Loading orders…
          </div>
        ) : orders.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '64px 24px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
            }}
          >
            <img
              src="/src/assets/images/empty-state.svg"
              alt=""
              style={{ width: '80px', height: '80px', marginBottom: '16px', opacity: 0.5 }}
            />
            <p style={{ fontSize: '16px', color: '#495057', margin: 0 }}>No orders found.</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
                overflow: 'hidden',
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: '#f8f9fa',
                        borderBottom: '1px solid #e9ecef',
                      }}
                    >
                      {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Action'].map(
                        (col) => (
                          <th
                            key={col}
                            style={{
                              padding: '12px 16px',
                              textAlign: 'left',
                              fontSize: '12px',
                              fontWeight: '600',
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                              color: '#495057',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {col}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => (
                      <tr
                        key={order.id || order.orderId || idx}
                        style={{
                          borderBottom: '1px solid #e9ecef',
                          backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8f9fa',
                        }}
                      >
                        <td
                          style={{
                            padding: '14px 16px',
                            fontFamily:
                              "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                            fontSize: '13px',
                            color: '#212529',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {order.id || order.orderId || '—'}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#212529' }}>
                          <div style={{ fontWeight: '500' }}>
                            {order.customer_name ||
                              order.customerName ||
                              order.customer?.name ||
                              '—'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#495057' }}>
                            {order.customer_email ||
                              order.customerEmail ||
                              order.customer?.email ||
                              ''}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '14px 16px',
                            color: '#495057',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {order.created_at || order.createdAt
                            ? new Date(
                                order.created_at || order.createdAt
                              ).toLocaleDateString()
                            : '—'}
                        </td>
                        <td
                          style={{
                            padding: '14px 16px',
                            color: '#495057',
                            textAlign: 'center',
                          }}
                        >
                          {order.item_count ||
                            order.itemCount ||
                            order.items?.length ||
                            '—'}
                        </td>
                        <td
                          style={{
                            padding: '14px 16px',
                            color: '#212529',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          ₹
                          {(order.total ||
                            order.total_amount ||
                            order.totalAmount ||
                            0
                          ).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <StatusBadge status={order.status} />
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <Link
                            to={`/admin/orders/${order.id || order.orderId}`}
                            style={{
                              display: 'inline-block',
                              padding: '7px 16px',
                              backgroundColor: '#4c6ef5',
                              color: '#ffffff',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: '600',
                              textDecoration: 'none',
                              whiteSpace: 'nowrap',
                              minHeight: '36px',
                              lineHeight: '20px',
                            }}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '24px',
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #868e96',
                    backgroundColor: page === 1 ? '#e9ecef' : '#ffffff',
                    color: page === 1 ? '#adb5bd' : '#212529',
                    fontSize: '14px',
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    minHeight: '44px',
                  }}
                >
                  Previous
                </button>
                <span
                  style={{
                    fontSize: '14px',
                    color: '#495057',
                    padding: '0 8px',
                  }}
                >
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #868e96',
                    backgroundColor: page === totalPages ? '#e9ecef' : '#ffffff',
                    color: page === totalPages ? '#adb5bd' : '#212529',
                    fontSize: '14px',
                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                    minHeight: '44px',
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
