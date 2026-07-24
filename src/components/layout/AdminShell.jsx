import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

/**
 * AdminShell — wraps all admin pages.
 * Gate: checks for an admin token/role in localStorage.
 * If not admin, redirects to /auth/login.
 */
const AdminShell = () => {
  const isAdmin = (() => {
    try {
      const raw = localStorage.getItem('auth');
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return parsed && parsed.role === 'admin';
    } catch {
      return false;
    }
  })();

  if (!isAdmin) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f9fafb',
      }}
    >
      <AdminSidebar />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        <main style={{ flex: 1, padding: '32px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
