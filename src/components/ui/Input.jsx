import React, { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    id,
    label,
    error,
    hint,
    type = 'text',
    required = false,
    disabled = false,
    className = '',
    containerClassName = '',
    ...rest
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const errorId = inputId ? `${inputId}-error` : undefined;
  const hintId = inputId ? `${inputId}-hint` : undefined;

  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={
          [error ? errorId : null, hint ? hintId : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        className={[
          'block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder-gray-400',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
          disabled ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-white',
          className,
        ].join(' ')}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
