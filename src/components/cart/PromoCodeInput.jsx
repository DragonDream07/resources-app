import React, { useState } from 'react';
import checkIcon from '@/assets/icons/check.svg';

const PromoCodeInput = ({ appliedPromo, onApply, onRemove, loading, error }) => {
  const [code, setCode] = useState('');

  const handleApply = () => {
    if (code.trim()) {
      onApply(code.trim());
    }
  };

  const handleRemove = () => {
    setCode('');
    onRemove();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  if (appliedPromo) {
    return (
      <div className="promo-code">
        <div className="promo-code__applied">
          <img src={checkIcon} alt="Applied" width={16} height={16} className="promo-code__check-icon" />
          <span className="promo-code__applied-label">
            Promo <strong>{appliedPromo.code}</strong> applied
          </span>
          {appliedPromo.discountLabel && (
            <span className="promo-code__discount-label">{appliedPromo.discountLabel}</span>
          )}
          <button
            className="promo-code__remove-btn"
            onClick={handleRemove}
            aria-label="Remove promo code"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="promo-code">
      <p className="promo-code__heading">Have a promo code?</p>
      <div className="promo-code__input-row">
        <input
          type="text"
          className={`promo-code__input${error ? ' promo-code__input--error' : ''}`}
          placeholder="Enter promo code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Promo code"
          disabled={loading}
        />
        <button
          className="promo-code__apply-btn"
          onClick={handleApply}
          disabled={loading || !code.trim()}
        >
          {loading ? 'Applying…' : 'Apply'}
        </button>
      </div>
      {error && <p className="promo-code__error">{error}</p>}
    </div>
  );
};

export default PromoCodeInput;
