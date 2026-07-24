import React from 'react';

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
  xl: 'h-16 w-16 border-4',
};

const Spinner = ({ size = 'md', label = 'Loading…', className = '' }) => {
  return (
    <span role="status" aria-label={label} className={`inline-flex items-center justify-center ${className}`}>
      <span
        className={[
          'animate-spin rounded-full border-current border-t-transparent',
          sizeClasses[size] || sizeClasses.md,
        ].join(' ')}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
};

export default Spinner;
