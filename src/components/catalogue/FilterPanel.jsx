import React, { useState } from 'react';
import chevronDown from '@/assets/icons/chevron-down.svg';
import starIcon from '@/assets/icons/star.svg';

const RATING_OPTIONS = [4, 3, 2, 1];

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="filter-section"
      style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '16px' }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0 0 12px 0',
          fontSize: '14px',
          fontWeight: 600,
          color: '#111827',
        }}
        aria-expanded={open}
      >
        {title}
        <img
          src={chevronDown}
          alt=""
          style={{
            width: '16px',
            height: '16px',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        />
      </button>
      {open && <div className="filter-section__content">{children}</div>}
    </div>
  );
};

const FilterPanel = ({
  brands = [],
  selectedBrands = [],
  onBrandChange,
  priceRange = { min: 0, max: 10000 },
  selectedPriceRange = { min: 0, max: 10000 },
  onPriceRangeChange,
  selectedRating = null,
  onRatingChange,
  facetCounts = {},
}) => {
  const handleBrandToggle = (brandId) => {
    const updated = selectedBrands.includes(brandId)
      ? selectedBrands.filter((id) => id !== brandId)
      : [...selectedBrands, brandId];
    if (onBrandChange) onBrandChange(updated);
  };

  const handleMinPrice = (e) => {
    const val = Number(e.target.value);
    if (onPriceRangeChange) onPriceRangeChange({ ...selectedPriceRange, min: val });
  };

  const handleMaxPrice = (e) => {
    const val = Number(e.target.value);
    if (onPriceRangeChange) onPriceRangeChange({ ...selectedPriceRange, max: val });
  };

  const handleRatingSelect = (rating) => {
    if (onRatingChange) onRatingChange(selectedRating === rating ? null : rating);
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
    padding: '4px 0',
    userSelect: 'none',
  };

  const countStyle = {
    marginLeft: 'auto',
    fontSize: '12px',
    color: '#9ca3af',
  };

  return (
    <aside
      className="filter-panel"
      style={{
        width: '240px',
        flexShrink: 0,
        fontSize: '14px',
      }}
    >
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px', marginTop: 0 }}>
        Filters
      </h2>

      {brands.length > 0 && (
        <FilterSection title="Brand">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {brands.map((brand) => {
              const count = facetCounts.brands ? facetCounts.brands[brand.brandId] : undefined;
              return (
                <label key={brand.brandId} style={labelStyle}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.brandId)}
                    onChange={() => handleBrandToggle(brand.brandId)}
                    style={{ accentColor: '#2563eb', width: '16px', height: '16px' }}
                  />
                  {brand.name}
                  {count != null && <span style={countStyle}>({count})</span>}
                </label>
              );
            })}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Price Range">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>Min ₹</label>
            <input
              type="number"
              min={priceRange.min}
              max={selectedPriceRange.max}
              value={selectedPriceRange.min}
              onChange={handleMinPrice}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '13px',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>Max ₹</label>
            <input
              type="number"
              min={selectedPriceRange.min}
              max={priceRange.max}
              value={selectedPriceRange.max}
              onChange={handleMaxPrice}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '13px',
              }}
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {RATING_OPTIONS.map((rating) => {
            const count = facetCounts.ratings ? facetCounts.ratings[rating] : undefined;
            return (
              <label key={rating} style={labelStyle}>
                <input
                  type="radio"
                  name="rating-filter"
                  checked={selectedRating === rating}
                  onChange={() => handleRatingSelect(rating)}
                  style={{ accentColor: '#2563eb', width: '16px', height: '16px' }}
                />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                  {Array.from({ length: rating }).map((_, i) => (
                    <img key={i} src={starIcon} alt="" style={{ width: '14px', height: '14px' }} />
                  ))}
                  <span style={{ marginLeft: '4px', color: '#374151' }}>{rating}★ & above</span>
                </span>
                {count != null && <span style={countStyle}>({count})</span>}
              </label>
            );
          })}
        </div>
      </FilterSection>
    </aside>
  );
};

export default FilterPanel;
