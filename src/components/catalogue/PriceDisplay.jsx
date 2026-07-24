import React from 'react';

const formatPrice = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const PriceDisplay = ({
  price,
  originalPrice = null,
  currency = 'INR',
  size = 'md',
  showTaxLabel = true,
}) => {
  const sizeMap = {
    sm: { price: '14px', original: '12px' },
    md: { price: '16px', original: '13px' },
    lg: { price: '22px', original: '15px' },
  };

  const sizes = sizeMap[size] || sizeMap.md;

  const hasDiscount = originalPrice != null && originalPrice > price;

  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  return (
    <div
      className="price-display"
      style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '6px' }}
    >
      <span
        className="price-display__current"
        style={{
          fontSize: sizes.price,
          fontWeight: 700,
          color: '#111827',
        }}
      >
        {price != null ? formatPrice(price, currency) : '—'}
      </span>
      {hasDiscount && (
        <span
          className="price-display__original"
          style={{
            fontSize: sizes.original,
            color: '#9ca3af',
            textDecoration: 'line-through',
          }}
        >
          {formatPrice(originalPrice, currency)}
        </span>
      )}
      {hasDiscount && discountPercent > 0 && (
        <span
          className="price-display__discount"
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#16a34a',
            backgroundColor: '#dcfce7',
            borderRadius: '4px',
            padding: '1px 6px',
          }}
        >
          {discountPercent}% off
        </span>
      )}
      {showTaxLabel && (
        <span
          className="price-display__tax-label"
          style={{ fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap' }}
        >
          (incl. tax)
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
