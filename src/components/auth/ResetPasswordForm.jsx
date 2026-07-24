import { useState } from 'react';

const ResetPasswordForm = ({ onSubmit, loading = false, error = null, token = '' }) => {
  const [values, setValues] = useState({ password: '', confirm_password: '' });
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = (fieldValues = values) => {
    const errors = {};

    if (!fieldValues.password) {
      errors.password = 'Password is required.';
    } else if (fieldValues.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    if (!fieldValues.confirm_password) {
      errors.confirm_password = 'Please confirm your password.';
    } else if (fieldValues.confirm_password !== fieldValues.password) {
      errors.confirm_password = 'Passwords do not match.';
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
    const allTouched = { password: true, confirm_password: true };
    setTouched(allTouched);
    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) {
      onSubmit && onSubmit({ token, password: values.password });
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
        <label htmlFor="reset-password">New password</label>
        <input
          id="reset-password"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="new-password"
          disabled={loading}
          aria-describedby={fieldErrors.password ? 'reset-password-error' : undefined}
          aria-invalid={!!fieldErrors.password}
          className={`form-input${fieldErrors.password ? ' form-input--error' : ''}`}
        />
        {fieldErrors.password && (
          <span id="reset-password-error" className="form-field-error" role="alert">
            {fieldErrors.password}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="reset-confirm-password">Confirm new password</label>
        <input
          id="reset-confirm-password"
          type="password"
          name="confirm_password"
          value={values.confirm_password}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="new-password"
          disabled={loading}
          aria-describedby={fieldErrors.confirm_password ? 'reset-confirm-password-error' : undefined}
          aria-invalid={!!fieldErrors.confirm_password}
          className={`form-input${fieldErrors.confirm_password ? ' form-input--error' : ''}`}
        />
        {fieldErrors.confirm_password && (
          <span id="reset-confirm-password-error" className="form-field-error" role="alert">
            {fieldErrors.confirm_password}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn--primary btn--full"
        disabled={loading}
      >
        {loading ? 'Resetting password…' : 'Reset password'}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
