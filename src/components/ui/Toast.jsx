import React, { useEffect, useRef } from 'react';

const typeConfig = {
  success: {
    containerClass: 'bg-green-50 border-green-400 text-green-900',
    iconClass: 'text-green-500',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    label: 'Success',
  },
  error: {
    containerClass: 'bg-red-50 border-red-400 text-red-900',
    iconClass: 'text-red-500',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
    label: 'Error',
  },
  info: {
    containerClass: 'bg-blue-50 border-blue-400 text-blue-900',
    iconClass: 'text-blue-500',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    label: 'Info',
  },
  warning: {
    containerClass: 'bg-yellow-50 border-yellow-400 text-yellow-900',
    iconClass: 'text-yellow-500',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-5a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    label: 'Warning',
  },
};

const Toast = ({ id, type = 'info', message, duration = 5000, onDismiss }) => {
  const timerRef = useRef(null);
  const config = typeConfig[type] || typeConfig.info;

  useEffect(() => {
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        onDismiss && onDismiss(id);
      }, duration);
    }
    return () => {
      clearTimeout(timerRef.current);
    };
  }, [id, duration, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={[
        'flex w-80 items-start gap-3 rounded-lg border px-4 py-3 shadow-lg',
        config.containerClass,
      ].join(' ')}
    >
      <span className={`mt-0.5 flex-shrink-0 ${config.iconClass}`}>
        {config.icon}
      </span>
      <div className="flex-1 text-sm">
        <p className="font-medium">{config.label}</p>
        {message && <p className="mt-0.5 opacity-80">{message}</p>}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss && onDismiss(id)}
        className="ml-auto flex-shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
