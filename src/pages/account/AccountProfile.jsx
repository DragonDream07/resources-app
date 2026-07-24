import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    margin: '0 0 8px 0',
    color: '#212529',
  },
  breadcrumb: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  sectionHeading: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    margin: '0 0 20px 0',
    color: '#212529',
  },
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '6px',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    padding: '12px 24px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #868e96',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    marginRight: '12px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  successBanner: {
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #868e96',
    margin: '24px 0',
  },
};

export default function AccountProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState(null);
  const [pwError, setPwError] = useState(null);
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    fetch('/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setUser(data);
        setName(data.name || data.full_name || '');
        setEmail(data.email || '');
      })
      .catch(() => setProfileError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileMsg(null);
    setProfileSaving(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch('/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setProfileError(data.detail || 'Failed to update profile.');
      } else {
        setProfileMsg('Profile updated successfully.');
      }
    } catch {
      setProfileError('An unexpected error occurred.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError(null);
    setPwMsg(null);
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    setPwSaving(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch('/users/me/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setPwError(data.detail || 'Failed to change password.');
      } else {
        setPwMsg('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setPwError('An unexpected error occurred.');
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ height: '40px', width: '200px', backgroundColor: '#e9ecef', borderRadius: '6px', marginBottom: '32px' }} />
          <div style={{ height: '200px', backgroundColor: '#ffffff', borderRadius: '10px' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <Link to="/account" style={{ color: '#4c6ef5', textDecoration: 'none' }}>My Account</Link>
          {' › '}
          <span>Profile</span>
        </div>
        <h1 style={styles.pageTitle}>Account profile</h1>

        {/* Profile form */}
        <div style={styles.card}>
          <h2 style={styles.sectionHeading}>Personal details</h2>
          {profileError && <div style={styles.errorBanner}>{profileError}</div>}
          {profileMsg && <div style={styles.successBanner}>{profileMsg}</div>}
          <form onSubmit={handleProfileSave}>
            <div style={styles.fieldGroup}>
              <label htmlFor="profile-name" style={styles.label}>Full name</label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                style={styles.input}
                autoComplete="name"
                required
              />
            </div>
            <div style={styles.fieldGroup}>
              <label htmlFor="profile-email" style={styles.label}>Email address</label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={styles.input}
                autoComplete="email"
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" style={styles.btnGhost} onClick={() => navigate('/account')}>
                Cancel
              </button>
              <button type="submit" style={styles.btnPrimary} disabled={profileSaving}>
                {profileSaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Password form */}
        <div style={styles.card}>
          <h2 style={styles.sectionHeading}>Change password</h2>
          {pwError && <div style={styles.errorBanner}>{pwError}</div>}
          {pwMsg && <div style={styles.successBanner}>{pwMsg}</div>}
          <form onSubmit={handlePasswordChange}>
            <div style={styles.fieldGroup}>
              <label htmlFor="current-password" style={styles.label}>Current password</label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                style={styles.input}
                autoComplete="current-password"
                required
              />
            </div>
            <div style={styles.fieldGroup}>
              <label htmlFor="new-password" style={styles.label}>New password</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={styles.input}
                autoComplete="new-password"
                required
              />
            </div>
            <div style={styles.fieldGroup}>
              <label htmlFor="confirm-password" style={styles.label}>Confirm new password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={styles.input}
                autoComplete="new-password"
                required
              />
            </div>
            <button type="submit" style={styles.btnPrimary} disabled={pwSaving}>
              {pwSaving ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/account/notifications" style={{ color: '#4c6ef5', fontSize: '14px', textDecoration: 'none' }}>Notifications</Link>
          <span style={{ color: '#868e96' }}>|</span>
          <Link to="/account/orders" style={{ color: '#4c6ef5', fontSize: '14px', textDecoration: 'none' }}>Order history</Link>
        </div>
      </div>
    </div>
  );
}
