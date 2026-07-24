import React from 'react';
import { Link } from 'react-router-dom';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';

/**
 * Breadcrumb — renders a generic breadcrumb trail.
 *
 * @param {Array<{ label: string, to?: string }>} items
 *   Each item has a `label` and an optional `to` path.
 *   The last item is treated as the current page (no link, visually distinct).
 */
const Breadcrumb = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          gap: '4px',
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={index}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {!isLast && item.to ? (
                <Link
                  to={item.to}
                  style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  style={{
                    fontSize: '14px',
                    color: isLast ? '#111827' : '#6b7280',
                    fontWeight: isLast ? 500 : 400,
                  }}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <img
                  src={chevronRightIcon}
                  alt=""
                  style={{ width: '14px', height: '14px', opacity: 0.5 }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
