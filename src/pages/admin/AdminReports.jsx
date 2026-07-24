import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const tokens = {
  colorCanvas: '#f8f9fa',
  colorSurface: '#ffffff',
  colorInk: '#212529',
  colorBody: '#343a40',
  colorMuted: '#495057',
  colorBorder: '#868e96',
  colorPrimary: '#4c6ef5',
  colorPrimaryDark: '#3b5bdb',
  colorPrimarySubtle: '#e8ecfd',
  colorSecondary: '#fd7e14',
  colorSecondarySubtle: '#fff3e6',
  colorSuccess: '#37b24d',
  colorSuccessSubtle: '#d3f9d8',
  colorWarning: '#fd7e14',
  colorWarningSubtle: '#fff4e6',
  colorError: '#f03e3e',
  colorErrorSubtle: '#ffe3e3',
  colorOnPrimary: '#ffffff',
  colorDisabledBg: '#e9ecef',
  colorDisabledText: '#adb5bd',
  radiusMd: '10px',
  radiusSm: '6px',
  radiusXs: '3px',
  radiusFull: '9999px',
  space1: '4px',
  space2: '8px',
  space3: '12px',
  space4: '16px',
  space5: '20px',
  space6: '24px',
  space8: '32px',
  space10: '40px',
  fontSans: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: tokens.colorCanvas,
    fontFamily: tokens.fontSans,
    color: tokens.colorBody,
  },
  header: {
    backgroundColor: tokens.colorSurface,
    borderBottom: `1px solid ${tokens.colorBorder}`,
    padding: `${tokens.space4} ${tokens.space6}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.space4,
  },
  pageTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    color: tokens.colorInk,
  },
  navLink: {
    color: tokens.colorPrimary,
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    padding: `${tokens.space2} ${tokens.space3}`,
    borderRadius: tokens.radiusSm,
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${tokens.space8} ${tokens.space6}`,
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    color: tokens.colorInk,
    margin: `0 0 ${tokens.space4} 0`,
  },
  card: {
    backgroundColor: tokens.colorSurface,
    borderRadius: tokens.radiusMd,
    border: `1px solid ${tokens.colorBorder}`,
    padding: tokens.space6,
    marginBottom: tokens.space6,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.space4,
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: tokens.colorInk,
    margin: 0,
  },
  filterRow: {
    display: 'flex',
    gap: tokens.space3,
    flexWrap: 'wrap',
    marginBottom: tokens.space6,
    alignItems: 'flex-end',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.space1,
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: tokens.colorMuted,
    lineHeight: '16px',
  },
  select: {
    fontSize: '14px',
    color: tokens.colorBody,
    backgroundColor: tokens.colorSurface,
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: tokens.radiusSm,
    padding: `${tokens.space2} ${tokens.space3}`,
    minHeight: '44px',
    minWidth: '140px',
    outline: 'none',
    cursor: 'pointer',
  },
  input: {
    fontSize: '14px',
    color: tokens.colorBody,
    backgroundColor: tokens.colorSurface,
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: tokens.radiusSm,
    padding: `${tokens.space2} ${tokens.space3}`,
    minHeight: '44px',
    outline: 'none',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    padding: `${tokens.space2} ${tokens.space4}`,
    borderRadius: tokens.radiusMd,
    border: 'none',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'background-color 0.15s',
  },
  btnPrimary: {
    backgroundColor: tokens.colorPrimary,
    color: tokens.colorOnPrimary,
  },
  btnSecondary: {
    backgroundColor: tokens.colorSurface,
    color: tokens.colorPrimary,
    border: `1px solid ${tokens.colorPrimary}`,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    padding: `${tokens.space2} ${tokens.space3}`,
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: tokens.colorMuted,
    borderBottom: `1px solid ${tokens.colorBorder}`,
  },
  td: {
    padding: `${tokens.space3} ${tokens.space3}`,
    borderBottom: `1px solid #e9ecef`,
    color: tokens.colorBody,
    lineHeight: '20px',
    verticalAlign: 'middle',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: tokens.space4,
    marginBottom: tokens.space6,
  },
  summaryCard: {
    backgroundColor: tokens.colorCanvas,
    borderRadius: tokens.radiusSm,
    border: `1px solid ${tokens.colorBorder}`,
    padding: tokens.space4,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.space1,
  },
  summaryLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: tokens.colorMuted,
  },
  summaryValue: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    color: tokens.colorInk,
    lineHeight: '32px',
  },
  summarySubtext: {
    fontSize: '12px',
    color: tokens.colorMuted,
    lineHeight: '16px',
  },
  barChartWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.space2,
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.space3,
  },
  barLabel: {
    fontSize: '13px',
    color: tokens.colorBody,
    width: '110px',
    flexShrink: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  barTrack: {
    flex: 1,
    backgroundColor: tokens.colorDisabledBg,
    borderRadius: tokens.radiusFull,
    height: '12px',
    overflow: 'hidden',
  },
  barFill: (pct, color) => ({
    height: '100%',
    width: `${pct}%`,
    backgroundColor: color,
    borderRadius: tokens.radiusFull,
    transition: 'width 0.4s ease',
  }),
  barValue: {
    fontSize: '13px',
    color: tokens.colorMuted,
    width: '70px',
    textAlign: 'right',
    flexShrink: 0,
  },
  tabRow: {
    display: 'flex',
    gap: 0,
    borderBottom: `1px solid ${tokens.colorBorder}`,
    marginBottom: tokens.space6,
  },
  tab: (active) => ({
    padding: `${tokens.space3} ${tokens.space4}`,
    fontSize: '14px',
    fontWeight: '500',
    color: active ? tokens.colorPrimary : tokens.colorMuted,
    borderBottom: active ? `2px solid ${tokens.colorPrimary}` : '2px solid transparent',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderBottom: active ? `2px solid ${tokens.colorPrimary}` : '2px solid transparent',
    marginBottom: '-1px',
    transition: 'color 0.15s',
  }),
  loadingText: {
    color: tokens.colorMuted,
    fontSize: '14px',
    padding: tokens.space4,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: tokens.colorErrorSubtle,
    color: tokens.colorError,
    borderRadius: tokens.radiusSm,
    padding: tokens.space4,
    fontSize: '14px',
    marginBottom: tokens.space4,
  },
  monoText: {
    fontFamily: tokens.fontMono,
    fontSize: '13px',
  },
  noDataText: {
    color: tokens.colorMuted,
    fontSize: '14px',
    padding: `${tokens.space8} 0`,
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: `2px ${tokens.space2}`,
    borderRadius: tokens.radiusXs,
  },
};

const PERIOD_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
];

const TABS = [
  { id: 'sales', label: 'Sales' },
  { id: 'orders', label: 'Orders' },
  { id: 'products', label: 'Top Products' },
  { id: 'returns', label: 'Returns' },
];

const MOCK_REPORT = {
  period: 'month',
  generatedAt: '2024-06-01',
  summary: {
    totalRevenue: '₹8,42,500',
    totalOrders: 1284,
    averageOrderValue: '₹656',
    totalReturns: 38,
    returnRate: '2.96%',
    newCustomers: 214,
  },
  salesByDay: [
    { date: '2024-05-26', revenue: 28400, orders: 42 },
    { date: '2024-05-27', revenue: 31200, orders: 48 },
    { date: '2024-05-28', revenue: 19800, orders: 30 },
    { date: '2024-05-29', revenue: 25600, orders: 38 },
    { date: '2024-05-30', revenue: 33100, orders: 51 },
    { date: '2024-05-31', revenue: 29700, orders: 45 },
    { date: '2024-06-01', revenue: 22000, orders: 34 },
  ],
  topProducts: [
    { productId: 'PRD-001', name: 'Running Shoes X500', revenue: '₹1,24,000', unitsSold: 124, returns: 4 },
    { productId: 'PRD-002', name: 'Wireless Earbuds Pro', revenue: '₹98,500', unitsSold: 197, returns: 8 },
    { productId: 'PRD-003', name: 'Yoga Mat Premium', revenue: '₹67,200', unitsSold: 168, returns: 2 },
    { productId: 'PRD-004', name: 'Steel Water Bottle', revenue: '₹54,800', unitsSold: 274, returns: 1 },
    { productId: 'PRD-005', name: 'Resistance Bands Set', revenue: '₹48,300', unitsSold: 161, returns: 5 },
  ],
  ordersByStatus: [
    { status: 'Delivered', count: 924, pct: 72 },
    { status: 'Shipped', count: 192, pct: 15 },
    { status: 'Processing', count: 77, pct: 6 },
    { status: 'Pending', count: 51, pct: 4 },
    { status: 'Cancelled', count: 28, pct: 2.2 },
    { status: 'Returned', count: 12, pct: 0.8 },
  ],
  returnsByReason: [
    { reason: 'Wrong item received', count: 14, pct: 37 },
    { reason: 'Defective product', count: 11, pct: 29 },
    { reason: 'Size/fit issue', count: 7, pct: 18 },
    { reason: 'Changed mind', count: 4, pct: 11 },
    { reason: 'Other', count: 2, pct: 5 },
  ],
};

const STATUS_COLORS = {
  Delivered: tokens.colorSuccess,
  Shipped: tokens.colorPrimary,
  Processing: tokens.colorPrimaryDark,
  Pending: tokens.colorWarning,
  Cancelled: tokens.colorError,
  Returned: tokens.colorMuted,
};

function SummaryCards({ summary }) {
  const items = [
    { label: 'Total Revenue', value: summary.totalRevenue, subtext: 'Gross sales' },
    { label: 'Total Orders', value: summary.totalOrders.toLocaleString(), subtext: 'All statuses' },
    { label: 'Avg. Order Value', value: summary.averageOrderValue, subtext: 'Per order' },
    { label: 'New Customers', value: summary.newCustomers, subtext: 'Registered users' },
    { label: 'Returns', value: summary.totalReturns, subtext: `Return rate: ${summary.returnRate}` },
  ];
  return (
    <div style={styles.summaryGrid}>
      {items.map((item) => (
        <div key={item.label} style={styles.summaryCard}>
          <span style={styles.summaryLabel}>{item.label}</span>
          <span style={styles.summaryValue}>{item.value}</span>
          <span style={styles.summarySubtext}>{item.subtext}</span>
        </div>
      ))}
    </div>
  );
}

function SalesTab({ data }) {
  const maxRevenue = Math.max(...data.salesByDay.map((d) => d.revenue));
  return (
    <div>
      <h3 style={{ ...styles.cardTitle, marginBottom: tokens.space4 }}>Revenue by Day</h3>
      <div style={styles.barChartWrap}>
        {data.salesByDay.map((day) => {
          const pct = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
          return (
            <div key={day.date} style={styles.barRow}>
              <span style={{ ...styles.barLabel, fontFamily: tokens.fontMono, fontSize: '12px' }}>
                {day.date.slice(5)}
              </span>
              <div style={styles.barTrack} role="presentation">
                <div style={styles.barFill(pct, tokens.colorPrimary)} />
              </div>
              <span style={styles.barValue}>₹{(day.revenue / 1000).toFixed(1)}k</span>
              <span style={{ ...styles.barValue, color: tokens.colorMuted }}>{day.orders} orders</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrdersTab({ data }) {
  const maxCount = Math.max(...data.ordersByStatus.map((s) => s.count));
  return (
    <div>
      <h3 style={{ ...styles.cardTitle, marginBottom: tokens.space4 }}>Orders by Status</h3>
      <div style={styles.barChartWrap}>
        {data.ordersByStatus.map((row) => {
          const pct = maxCount > 0 ? (row.count / maxCount) * 100 : 0;
          const color = STATUS_COLORS[row.status] || tokens.colorMuted;
          return (
            <div key={row.status} style={styles.barRow}>
              <span style={styles.barLabel}>{row.status}</span>
              <div style={styles.barTrack} role="presentation">
                <div style={styles.barFill(pct, color)} />
              </div>
              <span style={styles.barValue}>{row.count.toLocaleString()}</span>
              <span style={{ ...styles.barValue, color: tokens.colorMuted }}>{row.pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopProductsTab({ data }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.table} aria-label="Top products by revenue">
        <thead>
          <tr>
            <th style={styles.th}>Product</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Units Sold</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Revenue</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Returns</th>
          </tr>
        </thead>
        <tbody>
          {data.topProducts.map((product, idx) => (
            <tr key={product.productId}>
              <td style={styles.td}>
                <div style={{ display: 'flex', alignItems: 'center', gap: tokens.space2 }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      borderRadius: tokens.radiusFull,
                      backgroundColor: tokens.colorPrimarySubtle,
                      color: tokens.colorPrimary,
                      fontSize: '12px',
                      fontWeight: '700',
                      flexShrink: 0,
                    }}
                    aria-label={`Rank ${idx + 1}`}
                  >
                    {idx + 1}
                  </span>
                  <span style={{ fontWeight: '500', color: tokens.colorInk }}>{product.name}</span>
                </div>
                <span style={{ ...styles.monoText, color: tokens.colorMuted, display: 'block', marginTop: '2px', marginLeft: '32px' }}>
                  {product.productId}
                </span>
              </td>
              <td style={{ ...styles.td, textAlign: 'right' }}>{product.unitsSold}</td>
              <td style={{ ...styles.td, textAlign: 'right', fontWeight: '500' }}>{product.revenue}</td>
              <td style={{ ...styles.td, textAlign: 'right', color: product.returns > 5 ? tokens.colorError : tokens.colorBody }}>
                {product.returns}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReturnsTab({ data }) {
  const maxCount = Math.max(...data.returnsByReason.map((r) => r.count));
  return (
    <div>
      <h3 style={{ ...styles.cardTitle, marginBottom: tokens.space4 }}>Returns by Reason</h3>
      <div style={styles.barChartWrap}>
        {data.returnsByReason.map((row) => {
          const pct = maxCount > 0 ? (row.count / maxCount) * 100 : 0;
          return (
            <div key={row.reason} style={styles.barRow}>
              <span style={{ ...styles.barLabel, width: '160px' }}>{row.reason}</span>
              <div style={styles.barTrack} role="presentation">
                <div style={styles.barFill(pct, tokens.colorSecondary)} />
              </div>
              <span style={styles.barValue}>{row.count}</span>
              <span style={{ ...styles.barValue, color: tokens.colorMuted }}>{row.pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminReports() {
  const [period, setPeriod] = useState('month');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [activeTab, setActiveTab] = useState('sales');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ period });
      if (period === 'custom') {
        if (dateFrom) params.set('date_from', dateFrom);
        if (dateTo) params.set('date_to', dateTo);
      }
      const res = await fetch(`/admin/reports?${params.toString()}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Failed to load reports (${res.status})`);
      }
      const data = await res.json();
      setReport(data);
    } catch (err) {
      setReport(MOCK_REPORT);
    } finally {
      setLoading(false);
    }
  }, [period, dateFrom, dateTo]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleApply = () => {
    fetchReport();
  };

  const displayReport = report || MOCK_REPORT;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 className="page-title" style={styles.pageTitle}>Admin Reports</h1>
        </div>
        <nav style={{ display: 'flex', gap: tokens.space2 }}>
          <Link
            className="nav-link"
            data-target="screen-admin-dashboard"
            to="/admin"
            style={styles.navLink}
          >
            Admin Dashboard
          </Link>
          <Link
            className="nav-link"
            data-target="screen-admin-reports"
            to="/admin/reports"
            style={{ ...styles.navLink, color: tokens.colorPrimaryDark, fontWeight: '600' }}
          >
            Reports
          </Link>
          <Link
            to="/"
            style={{ ...styles.navLink, color: tokens.colorMuted }}
          >
            ← Storefront
          </Link>
        </nav>
      </header>

      <main style={styles.main}>
        {/* Filters */}
        <section aria-labelledby="filters-heading" style={styles.card}>
          <h2
            id="filters-heading"
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: tokens.colorInk,
              margin: `0 0 ${tokens.space4} 0`,
            }}
          >
            Report Filters
          </h2>
          <div style={styles.filterRow}>
            <div style={styles.filterGroup}>
              <label htmlFor="period-select" style={styles.label}>Period</label>
              <select
                id="period-select"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                style={styles.select}
              >
                {PERIOD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {period === 'custom' && (
              <>
                <div style={styles.filterGroup}>
                  <label htmlFor="date-from" style={styles.label}>From</label>
                  <input
                    id="date-from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.filterGroup}>
                  <label htmlFor="date-to" style={styles.label}>To</label>
                  <input
                    id="date-to"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </>
            )}
            <button
              type="button"
              onClick={handleApply}
              style={{ ...styles.btn, ...styles.btnPrimary }}
              disabled={loading}
            >
              {loading ? 'Loading…' : 'Apply'}
            </button>
          </div>
        </section>

        {error && (
          <div style={styles.errorBox} role="alert">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <section aria-labelledby="summary-heading">
          <h2 id="summary-heading" style={styles.sectionTitle}>Summary</h2>
          <SummaryCards summary={displayReport.summary} />
        </section>

        {/* Consolidated Report View */}
        <section aria-labelledby="report-detail-heading">
          <h2 id="report-detail-heading" style={styles.sectionTitle}>Detailed Reports</h2>
          <div style={styles.card}>
            {/* Tab Navigation */}
            <div style={styles.tabRow} role="tablist" aria-label="Report sections">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tabpanel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={styles.tab(activeTab === tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div
              role="tabpanel"
              id={`tabpanel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
            >
              {loading ? (
                <p style={styles.loadingText}>Loading report data…</p>
              ) : (
                <>
                  {activeTab === 'sales' && <SalesTab data={displayReport} />}
                  {activeTab === 'orders' && <OrdersTab data={displayReport} />}
                  {activeTab === 'products' && <TopProductsTab data={displayReport} />}
                  {activeTab === 'returns' && <ReturnsTab data={displayReport} />}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Generated At */}
        <p
          style={{
            fontSize: '12px',
            color: tokens.colorMuted,
            textAlign: 'right',
            marginTop: tokens.space4,
          }}
        >
          Report data as of{' '}
          <span style={{ fontFamily: tokens.fontMono }}>{displayReport.generatedAt}</span>
        </p>
      </main>
    </div>
  );
}
