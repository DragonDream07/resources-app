import React from 'react';

const VariantPicker = ({ skus = [], selectedSkuId = null, onSkuSelect }) => {
  if (!skus.length) return null;

  // Derive unique attribute axes from skus
  // Each sku is expected to have: skuId, attributes: { size, colour, ... }, stock
  const attributeKeys = skus.length > 0 && skus[0].attributes
    ? Object.keys(skus[0].attributes)
    : [];

  const selectedSku = skus.find((s) => s.skuId === selectedSkuId) || null;

  const getUniqueValues = (key) => {
    const seen = new Set();
    const values = [];
    skus.forEach((sku) => {
      const val = sku.attributes ? sku.attributes[key] : undefined;
      if (val != null && !seen.has(val)) {
        seen.add(val);
        values.push(val);
      }
    });
    return values;
  };

  // When a value for an axis is selected, we partially match then resolve to a sku
  const currentSelection = selectedSku ? { ...selectedSku.attributes } : {};

  const handleSelect = (key, value) => {
    const updatedSelection = { ...currentSelection, [key]: value };
    // Find a sku that matches all currently selected attributes
    const matched = skus.find((sku) =>
      sku.attributes &&
      Object.entries(updatedSelection).every(
        ([k, v]) => sku.attributes[k] === v
      )
    );
    if (matched) {
      onSkuSelect && onSkuSelect(matched.skuId, matched);
    } else {
      // Partial match: find a sku that at least matches the changed axis
      const partial = skus.find(
        (sku) => sku.attributes && sku.attributes[key] === value
      );
      if (partial) {
        onSkuSelect && onSkuSelect(partial.skuId, partial);
      }
    }
  };

  const isOutOfStock = (key, value) => {
    return skus
      .filter((sku) => sku.attributes && sku.attributes[key] === value)
      .every((sku) => sku.stock === 0);
  };

  const labelMap = {
    size: 'Size',
    colour: 'Colour',
    color: 'Color',
  };

  return (
    <div className="variant-picker" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {attributeKeys.map((key) => {
        const values = getUniqueValues(key);
        const isColor = key === 'colour' || key === 'color';
        return (
          <div key={key} className={`variant-picker__axis variant-picker__axis--${key}`}>
            <p
              style={{
                margin: '0 0 8px 0',
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
                textTransform: 'capitalize',
              }}
            >
              {labelMap[key] || key}:
              {currentSelection[key] && (
                <span style={{ fontWeight: 400, marginLeft: '6px', color: '#6b7280' }}>
                  {currentSelection[key]}
                </span>
              )}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {values.map((val) => {
                const oos = isOutOfStock(key, val);
                const selected = currentSelection[key] === val;
                if (isColor) {
                  return (
                    <button
                      key={val}
                      onClick={() => !oos && handleSelect(key, val)}
                      title={val}
                      disabled={oos}
                      aria-label={`${key}: ${val}`}
                      aria-pressed={selected}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: val.toLowerCase(),
                        border: selected ? '3px solid #2563eb' : '2px solid #d1d5db',
                        cursor: oos ? 'not-allowed' : 'pointer',
                        opacity: oos ? 0.4 : 1,
                        outline: 'none',
                        position: 'relative',
                      }}
                    />
                  );
                }
                return (
                  <button
                    key={val}
                    onClick={() => !oos && handleSelect(key, val)}
                    disabled={oos}
                    aria-pressed={selected}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '4px',
                      border: selected ? '2px solid #2563eb' : '1px solid #d1d5db',
                      backgroundColor: selected ? '#eff6ff' : '#ffffff',
                      color: selected ? '#1d4ed8' : '#374151',
                      fontSize: '13px',
                      fontWeight: selected ? 600 : 400,
                      cursor: oos ? 'not-allowed' : 'pointer',
                      opacity: oos ? 0.4 : 1,
                      position: 'relative',
                    }}
                  >
                    {val}
                    {oos && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: 0,
                          right: 0,
                          height: '1px',
                          backgroundColor: '#9ca3af',
                          transform: 'translateY(-50%) rotate(-15deg)',
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {selectedSku && selectedSku.stock != null && (
        <p style={{ margin: 0, fontSize: '13px', color: selectedSku.stock > 0 ? '#16a34a' : '#ef4444' }}>
          {selectedSku.stock > 0 ? `In stock (${selectedSku.stock} available)` : 'Out of stock'}
        </p>
      )}
    </div>
  );
};

export default VariantPicker;
