import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: '16px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 2px 16px rgba(33,37,41,0.08)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    textAlign: 'center',
    marginBottom: '12px',
  },
  description: {
    fontSize: '14px',
    color: '#495057',
    textAlign: 'center',
    lineHeight: '20px',
    marginBottom: '32px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#212529',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    color: '#343a40',
    background: '#ffffff',
    boxSizing: 'border-box',
    lineHeight: '24px',
  },
  inputError: {
    borderColor: '#f03e3e',
  },
  fieldGroup: {
    marginBottom: '20px',
  },
  fieldError: {
    color: '#f03e3e',
    fontSize: '12px',
    lineHeight: '16px',
    marginTop: '4px',
    display: 'block',
  },
  errorBanner: {
    background: '#ffe3e3',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    color: '#f03e3e',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    background: '#4c6ef5',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    lineHeight: '24px',
    minHeight: '44px',
    marginBottom: '16px',
  },
  submitBtnDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  signInRow: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#495057',
    marginTop: '4px',
  },
  link: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontWeight: '500',
    marginLeft: '4px',
  },
  successPanel: {
    textAlign: 'center',
    padding: '8px 0',
  },
  successIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    display: 'block',
  },
  successHeading: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '12px',
    lineHeight: '28px',
  },
  successText: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    marginBottom: '32px',
  },
  successBtn: {
    display: 'inline-block',
    padding: '12px 32px',
    background: '#4c6ef5',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    lineHeight: '24px',
    minHeight: '44px',
    textDecoration: 'none',
  },
  invalidTokenPanel: {
    textAlign: 'center',
    padding: '8px 0',
  },
  invalidIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    display: 'block',
  },
  invalidHeading: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#f03e3e',
    marginBottom: '12px',
    lineHeight: '28px',
  },
  invalidText: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    marginBottom: '32px',
  },
  passwordRow: {
    position: 'relative',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#495057',
    fontSize: '14px',
    padding: '4px',
  },
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [bannerError, setBannerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [invalidToken, setInvalidToken] = useState(!token);

  function validate() {
    const errors = {};
    if (!password || password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }
    if (confirm !== password) {
      errors.confirm = 'Passwords do not match.';
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBannerError('');

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (res.status === 400 || res.status === 422) {
        setInvalidToken(true);
        return;
      }
      if (res.status === 429) {
        setBannerError('Too many attempts. Please wait before trying again.');
        return;
      }
      if (!res.ok) {
        throw new Error('Network error');
      }
      setSuccess(true);
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (invalidToken) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.invalidTokenPanel}>
            <span style={styles.invalidIcon} aria-hidden="true">⚠️</span>
            <h2 style={styles.invalidHeading}>Invalid or expired link</h2>
            <p style={styles.invalidText}>
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link to="/forgot-password" style={styles.successBtn}>
              Request a new link
            </Link>
            <div style={{ marginTop: '16px' }}>
              <Link to="/login" style={styles.link}>Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.successPanel}>
            <span style={styles.successIcon} aria-hidden="true">✅</span>
            <h2 style={styles.successHeading}>Password reset successfully</h2>
            <p style={styles.successText}>
              Your password has been updated. Please sign in with your new password.
            </p>
            <Link to="/login" style={styles.successBtn}>
              Go to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Reset password</h1>
        <p style={styles.description}>
          Choose a new password for your account.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldGroup}>
            <label htmlFor="reset-password" style={styles.label}>New password</label>
            <div style={styles.passwordRow}>
              <input
                id="reset-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setFieldErrors(prev => ({ ...prev, password: '' }));
                }}
                style={{
                  ...styles.input,
                  paddingRight: '44px',
                  ...(fieldErrors.password ? styles.inputError : {}),
                }}
                required
              />
              <button
                type="button"
                style={styles.eyeBtn}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            {fieldErrors.password && (
              <span style={styles.fieldError} role="alert">{fieldErrors.password}</span>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="reset-confirm" style={styles.label}>Confirm new password</label>
            <div style={styles.passwordRow}>
              <input
                id="reset-confirm"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirm}
                onChange={e => {
                  setConfirm(e.target.value);
                  setFieldErrors(prev => ({ ...prev, confirm: '' }));
                }}
                style={{
                  ...styles.input,
                  paddingRight: '44px',
                  ...(fieldErrors.confirm ? styles.inputError : {}),
                }}
                required
              />
              <button
                type="button"
                style={styles.eyeBtn}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                onClick={() => setShowConfirm(v => !v)}
              >
                {showConfirm ? '🙈' : '👁'}
              </button>
            </div>
            {fieldErrors.confirm && (
              <span style={styles.fieldError} role="alert">{fieldErrors.confirm}</span>
            )}
          </div>

          {bannerError && (
            <div style={styles.errorBanner} role="alert">
              <span>⚠</span>
              <span>{bannerError}</span>
            </div>
          )}

          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? 'Saving…' : 'Set new password'}
          </button>

          <div style={styles.signInRow}>
            Remember your password?
            <Link to="/login" style={styles.link}>Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
