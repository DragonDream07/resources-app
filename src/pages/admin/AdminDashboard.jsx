import { useState, useEffect } from 'react';
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
  radiusMd: '10px',
  radiusSm: '6px',
  radiusXs: '3px',
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
    transition: 'background-color 0.15s',
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: tokens.space4,
    marginBottom: tokens.space8,
  },
  statCard: {
    backgroundColor: tokens.colorSurface,
    borderRadius: tokens.radiusMd,
    border: `1px solid ${tokens.colorBorder}`,
    padding: tokens.space6,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.space2,
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: tokens.colorMuted,
    lineHeight: '16px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: tokens.colorInk,
  },
  statSubtext: {
    fontSize: '14px',
    color: tokens.colorMuted,
    lineHeight: '20px',
  },
  statBadge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    padding: `2px ${tokens.space2}`,
    borderRadius: tokens.radiusXs,
    marginTop: tokens.space1,
  },
  tilesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: tokens.space4,
    marginBottom: tokens.space8,
  },
  tile: {
    backgroundColor: tokens.colorSurface,
    borderRadius: tokens.radiusMd,
    border: `1px solid ${tokens.colorBorder}`,
    padding: tokens.space6,
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.space3,
    transition: 'box-shadow 0.15s, border-color 0.15s',
    cursor: 'pointer',
  },
  tileIcon: {
    width: '40px',
    height: '40px',
    borderRadius: tokens.radiusSm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  tileTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: tokens.colorInk,
    margin: 0,
  },
  tileDesc: {
    fontSize: '14px',
    color: tokens.colorMuted,
    lineHeight: '20px',
    margin: 0,
  },
  tileArrow: {
    fontSize: '18px',
    color: tokens.colorPrimary,
    alignSelf: 'flex-end',
    marginTop: 'auto',
  },
  recentSection: {
    backgroundColor: tokens.colorSurface,
    borderRadius: tokens.radiusMd,
    border: `1px solid ${tokens.colorBorder}`,
    padding: tokens.space6,
    marginBottom: tokens.space8,
  },
  recentHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.space4,
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
  },
  statusBadge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: `2px ${tokens.space2}`,
    borderRadius: tokens.radiusXs,
  },
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
  viewAllLink: {
    fontSize: '14px',
    color: tokens.colorPrimary,
    textDecoration: 'none',
    fontWeight: '500',
  },
};

const STATUS_COLORS = {
  pending: { bg: tokens.colorWarningSubtle, color: tokens.colorWarning },
  confirmed: { bg: tokens.colorPrimarySubtle, color: tokens.colorPrimary },
  processing: { bg: tokens.colorPrimarySubtle, color: tokens.colorPrimaryDark },
  shipped: { bg: tokens.colorSuccessSubtle, color: tokens.colorSuccess },
  delivered: { bg: tokens.colorSuccessSubtle, color: tokens.colorSuccess },
  cancelled: { bg: tokens.colorErrorSubtle, color: tokens.colorError },
  returned: { bg: '#f1f3f5', color: tokens.colorMuted },
};

function getStatusStyle(status) {
  const key = (status || '').toLowerCase();
  return STATUS_COLORS[key] || { bg: '#f1f3f5', color: tokens.colorMuted };
}

const QUICK_TILES = [
  {
    icon: '📦',
    iconBg: tokens.colorPrimarySubtle,
    title: 'Products',
    desc: 'Manage product catalogue, SKUs, and images.',
    to: '/admin/products',
  },
  {
    icon: '🏷️',
    iconBg: tokens.colorSecondarySubtle,
    title: 'Categories',
    desc: 'Organise the category hierarchy.',
    to: '/admin/categories',
  },
  {
    icon: '🎁',
    iconBg: tokens.colorSuccessSubtle,
    title: 'Promo Codes',
    desc: 'Create and manage discount codes.',
    to: '/admin/promo-codes',
  },
  {
    icon: '↩️',
    iconBg: tokens.colorWarningSubtle,
    title: 'Return Requests',
    desc: 'Review and process customer returns.',
    to: '/admin/return-requests',
  },
  {
    icon: '📊',
    iconBg: tokens.colorPrimarySubtle,
    title: 'Reports',
    desc: 'View consolidated business reports.',
    to: '/admin/reports',
  },
  {
    icon: '🏢',
    iconBg: tokens.colorSecondarySubtle,
    title: 'Brands',
    desc: 'Add and manage product brands.',
    to: '/admin/brands',
  },
];

const MOCK_STATS = [
  { label: 'Total Orders', value: '1,284', subtext: 'All time', badgeText: '+12%', badgeBg: tokens.colorSuccessSubtle, badgeColor: tokens.colorSuccess },
  { label: 'Revenue', value: '₹8,42,500', subtext: 'All time', badgeText: '+8.3%', badgeBg: tokens.colorSuccessSubtle, badgeColor: tokens.colorSuccess },
  { label: 'Pending Orders', value: '47', subtext: 'Awaiting action', badgeText: null, badgeBg: null, badgeColor: null },
  { label: 'Return Requests', value: '9', subtext: 'Open requests', badgeText: null, badgeBg: null, badgeColor: null },
  { label: 'Active Products', value: '326', subtext: 'In catalogue', badgeText: null, badgeBg: null, badgeColor: null },
  { label: 'Promo Codes', value: '14', subtext: 'Active codes', badgeText: null, badgeBg: null, badgeColor: null },
];

const MOCK_RECENT_ORDERS = [
  { orderId: 'ORD-20240601-001', customer: 'Rahul Sharma', status: 'Pending', total: '₹2,350', date: '2024-06-01' },
  { orderId: 'ORD-20240531-042', customer: 'Priya Nair', status: 'Shipped', total: '₹1,100', date: '2024-05-31' },
  { orderId: 'ORD-20240531-039', customer: 'Amit Verma', status: 'Delivered', total: '₹4,780', date: '2024-05-31' },
  { orderId: 'ORD-20240530-017', customer: 'Sneha Kapoor', status: 'Cancelled', total: '₹890', date: '2024-05-30' },
  { orderId: 'ORD-20240529-008', customer: 'Vikram Singh', status: 'Confirmed', total: '₹3,200', date: '2024-05-29' },
];

export default function AdminDashboard() {
  const [stats] = useState(MOCK_STATS);
  const [recentOrders] = useState(MOCK_RECENT_ORDERS);
  const [loading] = useState(false);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 className="page-title" style={styles.pageTitle}>Admin Dashboard</h1>
        </div>
        <nav style={{ display: 'flex', gap: tokens.space2 }}>
          <Link
            className="nav-link"
            data-target="screen-admin-dashboard"
            to="/admin"
            style={styles.navLink}
          >
            Dashboard
          </Link>
          <Link
            className="nav-link"
            data-target="screen-admin-reports"
            to="/admin/reports"
            style={styles.navLink}
          >
            Admin Reports
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
        {loading && <p style={styles.loadingText}>Loading dashboard data…</p>}

        {/* Aggregated Stats */}
        <section aria-labelledby="stats-heading" style={{ marginBottom: tokens.space8 }}>
          <h2 id="stats-heading" style={styles.sectionTitle}>Overview</h2>
          <div style={styles.statsGrid}>
            {stats.map((stat) => (
              <div key={stat.label} style={styles.statCard}>
                <span style={styles.statLabel}>{stat.label}</span>
                <span style={styles.statValue}>{stat.value}</span>
                <span style={styles.statSubtext}>{stat.subtext}</span>
                {stat.badgeText && (
                  <span
                    style={{
                      ...styles.statBadge,
                      backgroundColor: stat.badgeBg,
                      color: stat.badgeColor,
                    }}
                  >
                    {stat.badgeText}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Quick-Access Tiles */}
        <section aria-labelledby="tiles-heading" style={{ marginBottom: tokens.space8 }}>
          <h2 id="tiles-heading" style={styles.sectionTitle}>Quick Access</h2>
          <div style={styles.tilesGrid}>
            {QUICK_TILES.map((tile) => (
              <Link
                key={tile.title}
                to={tile.to}
                style={styles.tile}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(76,110,245,0.12)';
                  e.currentTarget.style.borderColor = tokens.colorPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = tokens.colorBorder;
                }}
              >
                <div
                  style={{
                    ...styles.tileIcon,
                    backgroundColor: tile.iconBg,
                  }}
                  aria-hidden="true"
                >
                  {tile.icon}
                </div>
                <h3 style={styles.tileTitle}>{tile.title}</h3>
                <p style={styles.tileDesc}>{tile.desc}</p>
                <span style={styles.tileArrow} aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Orders */}
        <section aria-labelledby="recent-orders-heading">
          <div style={styles.recentSection}>
            <div style={styles.recentHeader}>
              <h2 id="recent-orders-heading" style={{ ...styles.sectionTitle, margin: 0 }}>
                Recent Orders
              </h2>
              <Link to="/admin/orders" style={styles.viewAllLink}>
                View all →
              </Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table} aria-label="Recent orders">
                <thead>
                  <tr>
                    <th style={styles.th}>Order ID</th>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Status</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const statusStyle = getStatusStyle(order.status);
                    return (
                      <tr key={order.orderId}>
                        <td style={styles.td}>
                          <span style={styles.monoText}>{order.orderId}</span>
                        </td>
                        <td style={styles.td}>{order.customer}</td>
                        <td style={{ ...styles.td, color: tokens.colorMuted }}>{order.date}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              backgroundColor: statusStyle.bg,
                              color: statusStyle.color,
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td style={{ ...styles.td, textAlign: 'right', fontWeight: '500' }}>
                          {order.total}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
