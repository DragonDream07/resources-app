import React, { useState, useCallback } from 'react';

function ReturnItemSelector({ items = [], onSelectionChange, maxItems }) {
  const [selected, setSelected] = useState({});
  const [quantities, setQuantities] = useState({});

  const eligibleItems = items.filter((item) => item.returnEligible !== false);

  const handleToggle = useCallback(
    (item) => {
      const id = item.orderItemId;
      setSelected((prev) => {
        const next = { ...prev };
        if (next[id]) {
          delete next[id];
        } else {
          if (maxItems && Object.keys(next).length >= maxItems) return prev;
          next[id] = true;
        }
        const updatedQuantities = { ...quantities };
        if (!next[id]) delete updatedQuantities[id];
        if (onSelectionChange) {
          const selectedItems = eligibleItems
            .filter((i) => next[i.orderItemId])
            .map((i) => ({
              orderItemId: i.orderItemId,
              quantity: updatedQuantities[i.orderItemId] || i.quantity || 1,
            }));
          onSelectionChange(selectedItems);
        }
        return next;
      });
    },
    [eligibleItems, maxItems, onSelectionChange, quantities]
  );

  const handleQuantityChange = useCallback(
    (item, value) => {
      const id = item.orderItemId;
      const max = item.quantity || 1;
      const parsed = Math.min(Math.max(1, parseInt(value, 10) || 1), max);
      setQuantities((prev) => {
        const next = { ...prev, [id]: parsed };
        if (onSelectionChange) {
          const selectedItems = eligibleItems
            .filter((i) => selected[i.orderItemId])
            .map((i) => ({
              orderItemId: i.orderItemId,
              quantity: next[i.orderItemId] || i.quantity || 1,
            }));
          onSelectionChange(selectedItems);
        }
        return next;
      });
    },
    [eligibleItems, onSelectionChange, selected]
  );

  if (items.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-4 text-center">
        No items available to return.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const id = item.orderItemId;
        const isEligible = item.returnEligible !== false;
        const isChecked = Boolean(selected[id]);
        const qty = quantities[id] || item.quantity || 1;

        return (
          <div
            key={id}
            className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
              !isEligible
                ? 'bg-gray-50 border-gray-200 opacity-60'
                : isChecked
                ? 'bg-blue-50 border-blue-300'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="checkbox"
              id={`return-item-${id}`}
              checked={isChecked}
              disabled={!isEligible}
              onChange={() => isEligible && handleToggle(item)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
            />

            <label
              htmlFor={`return-item-${id}`}
              className={`flex-1 min-w-0 ${isEligible ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.productName || '—'}
              </p>
              {item.skuLabel && (
                <p className="text-xs text-gray-500 mt-0.5">{item.skuLabel}</p>
              )}
              {!isEligible && (
                <p className="text-xs text-red-500 mt-0.5">Not eligible for return</p>
              )}
            </label>

            {isChecked && isEligible && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <label
                  htmlFor={`return-qty-${id}`}
                  className="text-xs text-gray-500 sr-only"
                >
                  Quantity
                </label>
                <span className="text-xs text-gray-500">Qty:</span>
                <input
                  id={`return-qty-${id}`}
                  type="number"
                  min={1}
                  max={item.quantity || 1}
                  value={qty}
                  onChange={(e) => handleQuantityChange(item, e.target.value)}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-400">/ {item.quantity || 1}</span>
              </div>
            )}

            {!isChecked && isEligible && item.quantity && (
              <span className="text-xs text-gray-400 flex-shrink-0">Qty: {item.quantity}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ReturnItemSelector;
