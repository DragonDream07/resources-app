import { useState } from 'react';

const RegisterForm = ({ onSubmit, loading = false, error = null }) => {
  const [values, setValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = (fieldValues = values) => {
    const errors = {};

    if (!fieldValues.first_name.trim()) {
      errors.first_name = 'First name is required.';
    }

    if (!fieldValues.last_name.trim()) {
      errors.last_name = 'Last name is required.';
    }

    if (!fieldValues.email) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValues.email)) {
      errors.email = 'Please enter a valid email address.';
    }

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
    const allTouched = {
      first_name: true,
      last_name: true,
      email: true,
      password: true,
      confirm_password: true,
    };
    setTouched(allTouched);
    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) {
      const { confirm_password, ...payload } = values;
      onSubmit && onSubmit(payload);
    }
  };

  const fields = [
    { name: 'first_name', label: 'First name', type: 'text', autoComplete: 'given-name' },
    { name: 'last_name', label: 'Last name', type: 'text', autoComplete: 'family-name' },
    { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email' },
    { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
    { name: 'confirm_password', label: 'Confirm password', type: 'password', autoComplete: 'new-password' },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="form-error-banner" role="alert">
          {error}
        </div>
      )}

      {fields.map(({ name, label, type, autoComplete }) => (
        <div className="form-group" key={name}>
          <label htmlFor={`register-${name}`}>{label}</label>
          <input
            id={`register-${name}`}
            type={type}
            name={name}
            value={values[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete={autoComplete}
            disabled={loading}
            aria-describedby={fieldErrors[name] ? `register-${name}-error` : undefined}
            aria-invalid={!!fieldErrors[name]}
            className={`form-input${fieldErrors[name] ? ' form-input--error' : ''}`}
          />
          {fieldErrors[name] && (
            <span id={`register-${name}-error`} className="form-field-error" role="alert">
              {fieldErrors[name]}
            </span>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="btn btn--primary btn--full"
        disabled={loading}
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
};

export default RegisterForm;
