import { useState } from 'react';

const LoginForm = ({ onSubmit, loading = false, error = null }) => {
  const [values, setValues] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = (fieldValues = values) => {
    const errors = {};
    if (!fieldValues.email) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValues.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!fieldValues.password) {
      errors.password = 'Password is required.';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...values, [name]: value };
    setValues(updated);
    if (touched[name]) {
      const errors = validate(updated);
      setFieldErrors((prev) => ({ ...prev, [name]: errors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errors = validate(values);
    setFieldErrors((prev) => ({ ...prev, [name]: errors[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = { email: true, password: true };
    setTouched(allTouched);
    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) {
      onSubmit && onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="form-error-banner" role="alert">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          disabled={loading}
          aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
          aria-invalid={!!fieldErrors.email}
          className={`form-input${fieldErrors.email ? ' form-input--error' : ''}`}
        />
        {fieldErrors.email && (
          <span id="login-email-error" className="form-field-error" role="alert">
            {fieldErrors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="current-password"
          disabled={loading}
          aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
          aria-invalid={!!fieldErrors.password}
          className={`form-input${fieldErrors.password ? ' form-input--error' : ''}`}
        />
        {fieldErrors.password && (
          <span id="login-password-error" className="form-field-error" role="alert">
            {fieldErrors.password}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn--primary btn--full"
        disabled={loading}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
};

export default LoginForm;
