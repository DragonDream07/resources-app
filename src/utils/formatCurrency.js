/**
 * Formats a numeric amount as Indian Rupees (₹) with locale-aware decimals.
 *
 * @param {number} amount - The amount to format.
 * @param {object} [options] - Optional Intl.NumberFormat options overrides.
 * @returns {string} Formatted currency string, e.g. "₹1,299.00"
 */
export function formatCurrency(amount, options = {}) {
  const defaultOptions = {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  };

  return new Intl.NumberFormat('en-IN', defaultOptions).format(amount);
}

/**
 * Formats a numeric amount as Indian Rupees without decimals when the value is whole.
 *
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrencyCompact(amount) {
  const isWhole = Number.isInteger(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: isWhole ? 0 : 2,
  }).format(amount);
}
