import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo.svg';
import searchIcon from '@/assets/icons/search.svg';
import cartIcon from '@/assets/icons/cart.svg';
import userIcon from '@/assets/icons/user.svg';
import bellIcon from '@/assets/icons/bell.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleAccountMenu = () => {
    setAccountMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '64px',
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src={logo} alt="Logo" style={{ height: '36px' }} />
      </Link>

      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          maxWidth: '480px',
          margin: '0 24px',
          background: '#f3f4f6',
          borderRadius: '8px',
          padding: '0 12px',
        }}
      >
        <img src={searchIcon} alt="Search" style={{ width: '18px', height: '18px', marginRight: '8px' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            flex: 1,
            fontSize: '14px',
            padding: '8px 0',
          }}
        />
      </form>

      {/* Right Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Notification Bell */}
        <Link to="/account/notifications" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={bellIcon} alt="Notifications" style={{ width: '22px', height: '22px' }} />
        </Link>

        {/* Cart */}
        <Link to="/cart" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={cartIcon} alt="Cart" style={{ width: '22px', height: '22px' }} />
        </Link>

        {/* Account Menu */}
        <div ref={accountMenuRef} style={{ position: 'relative' }}>
          <button
            onClick={toggleAccountMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            aria-label="Account menu"
          >
            <img src={userIcon} alt="Account" style={{ width: '22px', height: '22px' }} />
            <img src={chevronDownIcon} alt="" style={{ width: '14px', height: '14px' }} />
          </button>

          {accountMenuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '36px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                minWidth: '180px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 100,
              }}
            >
              <Link
                to="/account"
                style={styles.menuItem}
                onClick={() => setAccountMenuOpen(false)}
              >
                My Account
              </Link>
              <Link
                to="/account/orders"
                style={styles.menuItem}
                onClick={() => setAccountMenuOpen(false)}
              >
                Orders
              </Link>
              <Link
                to="/account/addresses"
                style={styles.menuItem}
                onClick={() => setAccountMenuOpen(false)}
              >
                Addresses
              </Link>
              <Link
                to="/auth/login"
                style={{ ...styles.menuItem, borderTop: '1px solid #e5e7eb' }}
                onClick={() => setAccountMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  menuItem: {
    display: 'block',
    padding: '10px 16px',
    fontSize: '14px',
    color: '#111827',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
};

export default Header;
