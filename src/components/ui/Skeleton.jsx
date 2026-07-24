import React from 'react';

const Skeleton = ({
  variant = 'rect',
  width,
  height,
  className = '',
  lines = 3,
}) => {
  const base =
    'animate-pulse rounded bg-gray-200';

  if (variant === 'circle') {
    const size = width || height || '3rem';
    return (
      <span
        aria-hidden="true"
        className={`block rounded-full bg-gray-200 animate-pulse ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (variant === 'text') {
    return (
      <div aria-hidden="true" className={`flex flex-col gap-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className={`block h-4 rounded bg-gray-200 animate-pulse ${i === lines - 1 ? 'w-4/5' : 'w-full'}`}
          />
        ))}
      </div>
    );
  }

  // default: rect
  return (
    <span
      aria-hidden="true"
      className={`block ${base} ${className}`}
      style={{
        width: width || '100%',
        height: height || '1rem',
      }}
    />
  );
};

export default Skeleton;
