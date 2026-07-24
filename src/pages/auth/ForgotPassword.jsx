import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8f9fa',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: '16px',
    paddingTop: '40px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 2px 16px rgba(33,37,41,0.08)',
    marginTop: '40px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    textAlign: 'center',
    marginBottom: '12px',
    marginTop: '40px',
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
  linksRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    marginTop: '8px',
  },
  link: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontWeight: '500',
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
};

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 320;
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setEmailError('');

    if (!validateEmail(email)) {
      setEmailError('Enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      // Always show success regardless of whether email exists (prevents enumeration)
      if (res.ok || res.status === 404) {
        setSubmitted(true);
        return;
      }
      if (!res.ok) {
        throw new Error('Network error');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {submitted ? (
          <div style={styles.successPanel}>
            <span style={styles.successIcon} aria-hidden="true">✉️</span>
            <h2 style={styles.successHeading}>Check your email</h2>
            <p style={styles.successText}>
              If that address is registered, a reset link is on its way. Check your inbox and follow the instructions to reset your password.
            </p>
            <Link to="/login" style={styles.successBtn}>
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 style={styles.heading}>Forgot password</h1>
            <p style={styles.description}>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div style={styles.fieldGroup}>
                <label htmlFor="forgot-email" style={styles.label}>Email address</label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  style={{
                    ...styles.input,
                    ...(emailError ? styles.inputError : {}),
                  }}
                  placeholder="you@example.com"
                  required
                />
                {emailError && (
                  <span style={styles.fieldError} role="alert">{emailError}</span>
                )}
              </div>

              <button
                type="submit"
                style={{
                  ...styles.submitBtn,
                  ...(loading ? styles.submitBtnDisabled : {}),
                }}
                disabled={loading}
              >
                {loading ? 'Sending…' : 'Reset password'}
              </button>

              <div style={styles.linksRow}>
                <Link
                  to="/login"
                  style={styles.link}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  style={styles.link}
                >
                  Create account
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
