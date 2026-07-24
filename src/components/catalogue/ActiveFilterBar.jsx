import React from 'react';
import closeIcon from '@/assets/icons/close.svg';

const ActiveFilterBar = ({ filters = [], onRemove, onClearAll }) => {
  if (!filters.length) return null;

  return (
    <div
      className="active-filter-bar"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 0',
      }}
    >
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>
        Applied Filters:
      </span>
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="active-filter-bar__chip"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '999px',
            padding: '4px 10px',
            fontSize: '13px',
            color: '#1d4ed8',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          {filter.label}
          <button
            onClick={() => { if (onRemove) onRemove(filter.key); }}
            aria-label={`Remove filter: ${filter.label}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              marginLeft: '2px',
            }}
          >
            <img
              src={closeIcon}
              alt="remove"
              style={{ width: '12px', height: '12px', opacity: 0.7 }}
            />
          </button>
        </span>
      ))}
      {filters.length > 1 && (
        <button
          onClick={() => { if (onClearAll) onClearAll(); }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#ef4444',
            fontWeight: 500,
            padding: '4px 8px',
            textDecoration: 'underline',
          }}
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default ActiveFilterBar;
