import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import chevronDown from '@/assets/icons/chevron-down.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';

const CategoryItem = ({ category, depth = 0, activeCategoryId }) => {
  const hasChildren = category.children && category.children.length > 0;
  const isActive = category.categoryId === activeCategoryId;
  const [expanded, setExpanded] = useState(isActive || false);

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: `6px 8px 6px ${8 + depth * 16}px`,
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: isActive ? 600 : 400,
    color: isActive ? '#1d4ed8' : '#374151',
    backgroundColor: isActive ? '#eff6ff' : 'transparent',
    textDecoration: 'none',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background-color 0.15s',
  };

  return (
    <li style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link
          to={`/categories/${category.categoryId}`}
          style={{ ...itemStyle, flex: 1 }}
        >
          {category.name}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setExpanded((e) => !e)}
            aria-label={expanded ? 'Collapse' : 'Expand'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              src={expanded ? chevronDown : chevronRight}
              alt=""
              style={{ width: '14px', height: '14px' }}
            />
          </button>
        )}
      </div>
      {hasChildren && expanded && (
        <ul style={{ margin: 0, padding: 0 }}>
          {category.children.map((child) => (
            <CategoryItem
              key={child.categoryId}
              category={child}
              depth={depth + 1}
              activeCategoryId={activeCategoryId}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const CategoryNav = ({ categories = [], activeCategoryId = null }) => {
  const params = useParams();
  const resolvedActiveCategoryId = activeCategoryId || params.categoryId || null;

  if (!categories.length) return null;

  return (
    <nav className="category-nav" aria-label="Category navigation">
      <h2
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: '#111827',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '8px',
          marginTop: 0,
        }}
      >
        Categories
      </h2>
      <ul style={{ margin: 0, padding: 0 }}>
        {categories.map((category) => (
          <CategoryItem
            key={category.categoryId}
            category={category}
            depth={0}
            activeCategoryId={resolvedActiveCategoryId}
          />
        ))}
      </ul>
    </nav>
  );
};

export default CategoryNav;
