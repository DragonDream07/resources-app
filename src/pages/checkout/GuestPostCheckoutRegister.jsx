import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '48px 16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    border: '1px solid #e9ecef',
    width: '100%',
    maxWidth: '480px',
    boxSizing: 'border-box',
  },
  logo: {
    display: 'block',
    margin: '0 auto 24px',
    height: '36px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    textAlign: 'center',
    color: '#212529',
    marginBottom: '8px',
  },
  subheading: {
    fontSize: '14px',
    lineHeight: '20px',
    color: '#495057',
    textAlign: 'center',
    marginBottom: '32px',
  },
  orderIdBanner: {
    backgroundColor: '#e8ecfd',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#3b5bdb',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    textAlign: 'center',
    marginBottom: '24px',
    wordBreak: 'break-all',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '16px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    lineHeight: '16px',
  },
  input: {
    padding: '12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#212529',
    backgroundColor: '#ffffff',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  inputError: {
    border: '1px solid #f03e3e',
    backgroundColor: '#ffe3e3',
  },
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    lineHeight: '16px',
  },
  passwordHint: {
    fontSize: '11px',
    color: '#495057',
    lineHeight: '16px',
    marginTop: '2px',
  },
  submitBtn: {
    width: '100%',
    padding: '14px 24px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    marginTop: '8px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  submitBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  skipLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '14px',
    color: '#495057',
  },
  skipBtn: {
    background: 'none',
    border: 'none',
    color: '#4c6ef5',
    cursor: 'pointer',
    fontSize: '14px',
    padding: 0,
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  successCard: {
    textAlign: 'center',
    padding: '32px 0 0',
  },
  successIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    display: 'block',
  },
  successHeading: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    marginBottom: '8px',
  },
  successText: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    marginBottom: '24px',
  },
  alertError: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  loginLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
  },
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function apiPost(path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(`POST ${path} failed: ${res.status}`), { data: err });
  }
  return res.json();
}

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Full name is required.';
  if (!form.email.trim()) errors.email = 'Email address is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid email address.';
  if (!form.password) errors.password = 'Password is required.';
  else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.';
  if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password.';
  else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  return errors;
}

export default function GuestPostCheckoutRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const data = await apiPost('/auth/guest-register', {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        orderId: orderId || undefined,
      });
      // Store token if provided
      if (data.token || data.access_token) {
        localStorage.setItem('authToken', data.token || data.access_token);
      }
      setSuccess(true);
    } catch (err) {
      setSubmitError(
        err?.data?.detail ||
        err?.data?.message ||
        'Registration failed. The email may already be in use.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleSkip() {
    navigate('/');
  }

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.successCard}>
            <span style={styles.successIcon} aria-hidden="true">🎉</span>
            <div style={styles.successHeading}>Account Created!</div>
            <p style={styles.successText}>
              Welcome! Your account is ready. You can now track your orders and enjoy a faster
              checkout experience.
            </p>
            <button
              type="button"
              style={styles.submitBtn}
              onClick={() => navigate(orderId ? `/orders/${orderId}` : '/')}
            >
              {orderId ? 'View My Order' : 'Go to Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img src="/src/assets/images/logo.svg" alt="Store logo" style={styles.logo} />

        <h1 style={styles.heading}>Create Your Account</h1>
        <p style={styles.subheading}>
          Save your details for faster checkouts and easy order tracking.
        </p>

        {orderId && (
          <div style={styles.orderIdBanner}>
            Order #{orderId} linked to your new account
          </div>
        )}

        {submitError && (
          <div role="alert" style={styles.alertError}>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
              value={form.name}
              onChange={handleField}
            />
            {errors.name && <span style={styles.errorText}>{errors.name}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane@example.com"
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
              value={form.email}
              onChange={handleField}
            />
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
              value={form.password}
              onChange={handleField}
            />
            {errors.password
              ? <span style={styles.errorText}>{errors.password}</span>
              : <span style={styles.passwordHint}>Must be at least 8 characters.</span>
            }
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              style={{ ...styles.input, ...(errors.confirmPassword ? styles.inputError : {}) }}
              value={form.confirmPassword}
              onChange={handleField}
            />
            {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              ...(submitting ? styles.submitBtnDisabled : {}),
            }}
            disabled={submitting}
          >
            {submitting ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <div style={styles.skipLink}>
          Already have an account?{' '}
          <Link to="/login" style={styles.loginLink}>Log in</Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <button type="button" style={styles.skipBtn} onClick={handleSkip}>
            No thanks, skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
