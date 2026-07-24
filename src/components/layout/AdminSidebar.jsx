import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '@/assets/images/logo.svg';
import menuIcon from '@/assets/icons/menu.svg';
import closeIcon from '@/assets/icons/close.svg';
import packageIcon from '@/assets/icons/package.svg';

const navItems = [
  {
    label: 'Dashboard',
    to: '/admin',
  },
  {
    label: 'Reports',
    to: '/admin/reports',
  },
  {
    label: 'Orders',
    to: '/admin/orders',
  },
  {
    label: 'Products',
    to: '/admin/catalogue/products',
  },
  {
    label: 'Categories',
    to: '/admin/catalogue/categories',
  },
  {
    label: 'Brands',
    to: '/admin/catalogue/brands',
  },
  {
    label: 'Promotions',
    to: '/admin/promotions',
  },
  {
    label: 'Returns',
    to: '/admin/returns',
  },
  {
    label: 'Users',
    to: '/admin/users',
  },
];

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: collapsed ? '64px' : '240px',
        background: '#1f2937',
        color: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        flexShrink: 0,
        minHeight: '100vh',
      }}
    >
      {/* Sidebar Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: '16px',
          borderBottom: '1px solid #374151',
          height: '64px',
        }}
      >
        {!collapsed && (
          <img src={logo} alt="Admin Logo" style={{ height: '28px', filter: 'brightness(0) invert(1)' }} />
        )}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <img
            src={collapsed ? menuIcon : closeIcon}
            alt={collapsed ? 'Expand' : 'Collapse'}
            style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }}
          />
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: collapsed ? '12px 0' : '10px 16px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: isActive ? '#ffffff' : '#9ca3af',
              background: isActive ? '#374151' : 'transparent',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: isActive ? 600 : 400,
              borderRadius: '4px',
              margin: '2px 8px',
              transition: 'background 0.15s, color 0.15s',
            })}
          >
            <img
              src={packageIcon}
              alt=""
              style={{ width: '18px', height: '18px', flexShrink: 0, filter: 'brightness(0) invert(1)' }}
            />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer */}
      {!collapsed && (
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid #374151',
            fontSize: '12px',
            color: '#6b7280',
          }}
        >
          Admin Panel
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
