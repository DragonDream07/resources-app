import { useState } from 'react';

const ForgotPasswordForm = ({ onSubmit, loading = false, error = null, success = false }) => {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const validate = (value) => {
    if (!value) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
    return '';
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    if (touched) {
      setFieldError(validate(value));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setFieldError(validate(email));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    const err = validate(email);
    setFieldError(err);
    if (!err) {
      if (onSubmit) onSubmit({ email });
    }
  };

  if (success) {
    return (
      <div className="form-success-message" role="status">
        If an account with that email exists, you will receive a password reset link shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="form-error-banner" role="alert">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="forgot-email">Email address</label>
        <input
          id="forgot-email"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          disabled={loading}
          aria-describedby={fieldError ? 'forgot-email-error' : undefined}
          aria-invalid={!!fieldError}
          className={`form-input${fieldError ? ' form-input--error' : ''}`}
        />
        {fieldError && (
          <span id="forgot-email-error" className="form-field-error" role="alert">
            {fieldError}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn--primary btn--full"
        disabled={loading}
      >
        {loading ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
