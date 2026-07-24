import React, { forwardRef } from 'react';

const Checkbox = forwardRef(function Checkbox(
  {
    id,
    label,
    error,
    hint,
    disabled = false,
    required = false,
    className = '',
    containerClassName = '',
    ...rest
  },
  ref
) {
  const checkId = id || (label ? `chk-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const errorId = checkId ? `${checkId}-error` : undefined;
  const hintId = checkId ? `${checkId}-hint` : undefined;

  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          id={checkId}
          type="checkbox"
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null]
              .filter(Boolean)
              .join(' ') || undefined
          }
          className={[
            'h-4 w-4 rounded border-gray-300 text-blue-600',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
            'transition-colors',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            className,
          ].join(' ')}
          {...rest}
        />
        {label && (
          <label
            htmlFor={checkId}
            className={[
              'text-sm text-gray-700 select-none',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            ].join(' ')}
          >
            {label}
            {required && (
              <span className="ml-1 text-red-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
      </div>
      {hint && !error && (
        <p id={hintId} className="ml-6 text-xs text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="ml-6 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

export default Checkbox;
