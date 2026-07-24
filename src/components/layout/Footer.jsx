import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = 2024;

  return (
    <footer
      style={{
        background: '#111827',
        color: '#d1d5db',
        padding: '40px 24px 24px',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '32px',
          marginBottom: '40px',
        }}
      >
        {/* Company */}
        <div>
          <h3 style={styles.footerHeading}>Company</h3>
          <ul style={styles.footerList}>
            <li><Link to="/about" style={styles.footerLink}>About Us</Link></li>
            <li><Link to="/careers" style={styles.footerLink}>Careers</Link></li>
            <li><Link to="/press" style={styles.footerLink}>Press</Link></li>
            <li><Link to="/blog" style={styles.footerLink}>Blog</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 style={styles.footerHeading}>Support</h3>
          <ul style={styles.footerList}>
            <li><Link to="/help" style={styles.footerLink}>Help Center</Link></li>
            <li><Link to="/contact" style={styles.footerLink}>Contact Us</Link></li>
            <li><Link to="/returns" style={styles.footerLink}>Returns</Link></li>
            <li><Link to="/shipping" style={styles.footerLink}>Shipping Info</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 style={styles.footerHeading}>Legal</h3>
          <ul style={styles.footerList}>
            <li><Link to="/privacy" style={styles.footerLink}>Privacy Policy</Link></li>
            <li><Link to="/terms" style={styles.footerLink}>Terms of Service</Link></li>
            <li><Link to="/cookies" style={styles.footerLink}>Cookie Policy</Link></li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 style={styles.footerHeading}>Account</h3>
          <ul style={styles.footerList}>
            <li><Link to="/auth/login" style={styles.footerLink}>Login</Link></li>
            <li><Link to="/auth/register" style={styles.footerLink}>Register</Link></li>
            <li><Link to="/account/orders" style={styles.footerLink}>Order History</Link></li>
            <li><Link to="/account" style={styles.footerLink}>My Account</Link></li>
          </ul>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          borderTop: '1px solid #374151',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <p style={{ fontSize: '13px', margin: 0 }}>
          &copy; {currentYear} MyStore. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/privacy" style={styles.footerLinkSmall}>Privacy</Link>
          <Link to="/terms" style={styles.footerLinkSmall}>Terms</Link>
          <Link to="/cookies" style={styles.footerLinkSmall}>Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footerHeading: {
    color: '#f9fafb',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '16px',
    marginTop: 0,
  },
  footerList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  footerLink: {
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: '14px',
  },
  footerLinkSmall: {
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: '13px',
  },
};

export default Footer;
