/**
 * Default GST rate used for display purposes (18%).
 * Prices stored in the system are assumed to be GST-inclusive.
 */
export const DEFAULT_GST_RATE = 0.18;

/**
 * Returns the GST-inclusive price as a number.
 * If the price is already inclusive, this is a pass-through.
 *
 * @param {number} inclusivePrice - The GST-inclusive price.
 * @returns {number}
 */
export function getInclusivePrice(inclusivePrice) {
  return inclusivePrice;
}

/**
 * Extracts the tax (GST) portion from a GST-inclusive price.
 *
 * Formula: taxAmount = price - (price / (1 + gstRate))
 *
 * @param {number} inclusivePrice - The GST-inclusive price.
 * @param {number} [gstRate=DEFAULT_GST_RATE] - The GST rate as a decimal (e.g. 0.18 for 18%).
 * @returns {number} The tax amount contained within the inclusive price.
 */
export function extractTaxAmount(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  if (!inclusivePrice || inclusivePrice <= 0) return 0;
  const taxAmount = inclusivePrice - inclusivePrice / (1 + gstRate);
  return parseFloat(taxAmount.toFixed(2));
}

/**
 * Returns the base (pre-tax) price from a GST-inclusive price.
 *
 * @param {number} inclusivePrice
 * @param {number} [gstRate=DEFAULT_GST_RATE]
 * @returns {number}
 */
export function getBasePrice(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  if (!inclusivePrice || inclusivePrice <= 0) return 0;
  const basePrice = inclusivePrice / (1 + gstRate);
  return parseFloat(basePrice.toFixed(2));
}

/**
 * Builds a GST breakdown object for display in order summaries.
 *
 * @param {number} inclusivePrice
 * @param {number} [gstRate=DEFAULT_GST_RATE]
 * @returns {{ basePrice: number, taxAmount: number, inclusivePrice: number, gstRate: number, gstPercent: number }}
 */
export function getTaxBreakdown(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  const basePrice = getBasePrice(inclusivePrice, gstRate);
  const taxAmount = extractTaxAmount(inclusivePrice, gstRate);
  return {
    basePrice,
    taxAmount,
    inclusivePrice: parseFloat(inclusivePrice.toFixed(2)),
    gstRate,
    gstPercent: gstRate * 100,
  };
}
