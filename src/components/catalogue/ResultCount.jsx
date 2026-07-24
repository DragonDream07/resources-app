import React from 'react';

const ResultCount = ({ total = 0, facets = {}, loading = false }) => {
  return (
    <div
      className="result-count"
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '14px',
        color: '#6b7280',
        minHeight: '24px',
      }}
    >
      {loading ? (
        <span
          style={{
            display: 'inline-block',
            width: '120px',
            height: '16px',
            borderRadius: '4px',
            backgroundColor: '#e5e7eb',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      ) : (
        <span className="result-count__total">
          <strong style={{ color: '#111827' }}>{total.toLocaleString('en-IN')}</strong>
          {total === 1 ? ' result' : ' results'}
        </span>
      )}
      {!loading && Object.keys(facets).length > 0 && (
        <div
          className="result-count__facets"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
        >
          {Object.entries(facets).map(([label, count]) => (
            <span
              key={label}
              className="result-count__facet"
              style={{
                fontSize: '12px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '999px',
                padding: '2px 10px',
                color: '#374151',
              }}
            >
              {label}: <strong>{count}</strong>
            </span>
          ))}
        </div>
      )}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default ResultCount;
