import React from 'react';

const variantConfig = {
  success: {
    containerClass: 'bg-green-100 text-green-800',
    icon: (
      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  error: {
    containerClass: 'bg-red-100 text-red-800',
    icon: (
      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  warning: {
    containerClass: 'bg-yellow-100 text-yellow-800',
    icon: (
      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-5a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  info: {
    containerClass: 'bg-blue-100 text-blue-800',
    icon: (
      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  neutral: {
    containerClass: 'bg-gray-100 text-gray-700',
    icon: (
      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="4" />
      </svg>
    ),
  },
};

const Badge = ({ variant = 'neutral', label, icon, className = '' }) => {
  const config = variantConfig[variant] || variantConfig.neutral;
  const displayIcon = icon !== undefined ? icon : config.icon;

  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.containerClass,
        className,
      ].join(' ')}
    >
      {displayIcon}
      <span>{label}</span>
    </span>
  );
};

export default Badge;
