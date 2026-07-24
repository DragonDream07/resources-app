import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    maxWidth: '480px',
    boxShadow: '0 2px 16px rgba(33,37,41,0.08)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtext: {
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
    flexWrap: 'wrap',
  },
  rateLimitBanner: {
    background: '#fff4e6',
    border: '1px solid #fd7e14',
    borderRadius: '6px',
    padding: '12px 16px',
    color: '#fd7e14',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '16px',
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
  },
  submitBtnDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  loginRow: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#495057',
    marginTop: '20px',
  },
  link: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontWeight: '500',
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

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 320;
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [bannerError, setBannerError] = useState('');
  const [rateLimitError, setRateLimitError] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [loading, setLoading] = useState(false);

  function setField(name, value) {
    setForm(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    if (name === 'email') setEmailExists(false);
  }

  function validate() {
    const errors = {};
    if (!validateEmail(form.email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (form.full_name.length > 255) {
      errors.full_name = 'Full name must not exceed 255 characters.';
    }
    if (form.phone && form.phone.length > 30) {
      errors.phone = 'Enter a valid phone number.';
    }
    if (!form.password || form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }
    if (form.confirm !== form.password) {
      errors.confirm = 'Passwords do not match.';
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBannerError('');
    setRateLimitError('');
    setEmailExists(false);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      if (res.status === 409) {
        setEmailExists(true);
        return;
      }
      if (res.status === 429) {
        setRateLimitError('Too many attempts. Please wait before trying again.');
        return;
      }
      if (!res.ok) {
        throw new Error('Network error');
      }
      navigate('/');
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.subtext}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Log in</Link>
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldGroup}>
            <label htmlFor="register-full-name" style={styles.label}>Full name</label>
            <input
              id="register-full-name"
              type="text"
              autoComplete="name"
              value={form.full_name}
              onChange={e => setField('full_name', e.target.value)}
              style={{
                ...styles.input,
                ...(fieldErrors.full_name ? styles.inputError : {}),
              }}
              placeholder="Jane Doe"
            />
            {fieldErrors.full_name && (
              <span style={styles.fieldError} role="alert">{fieldErrors.full_name}</span>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="register-email" style={styles.label}>Email address</label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={e => setField('email', e.target.value)}
              style={{
                ...styles.input,
                ...(fieldErrors.email || emailExists ? styles.inputError : {}),
              }}
              placeholder="you@example.com"
              required
            />
            {fieldErrors.email && (
              <span style={styles.fieldError} role="alert">{fieldErrors.email}</span>
            )}
            {emailExists && (
              <span style={styles.fieldError} role="alert">
                An account with this email already exists.{' '}
                <Link to="/login" style={{ color: '#f03e3e', fontWeight: '500' }}>Log in instead</Link>
              </span>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="register-phone" style={styles.label}>Phone number <span style={{ color: '#495057', fontWeight: 400 }}>(optional)</span></label>
            <input
              id="register-phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={e => setField('phone', e.target.value)}
              style={{
                ...styles.input,
                ...(fieldErrors.phone ? styles.inputError : {}),
              }}
              placeholder="+1 555 000 0000"
            />
            {fieldErrors.phone && (
              <span style={styles.fieldError} role="alert">{fieldErrors.phone}</span>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="register-password" style={styles.label}>Password</label>
            <div style={styles.passwordRow}>
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.password}
                onChange={e => setField('password', e.target.value)}
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
            <label htmlFor="register-confirm" style={styles.label}>Confirm password</label>
            <div style={styles.passwordRow}>
              <input
                id="register-confirm"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.confirm}
                onChange={e => setField('confirm', e.target.value)}
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

          {rateLimitError && (
            <div style={styles.rateLimitBanner} role="alert">
              {rateLimitError}
            </div>
          )}

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
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div style={styles.loginRow}>
          Already registered?{' '}
          <Link to="/login" style={styles.link}>Log in</Link>
        </div>
      </div>
    </div>
  );
}
