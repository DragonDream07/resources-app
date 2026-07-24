import React from 'react';

/**
 * PageWrapper — applies consistent horizontal padding and max-width constraint
 * to all standard content pages.
 */
const PageWrapper = ({ children, maxWidth = '1200px', style = {} }) => {
  return (
    <div
      style={{
        maxWidth,
        margin: '0 auto',
        padding: '24px 16px',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
