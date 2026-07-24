/**
 * Shipping thresholds and charges.
 */
export const FREE_SHIPPING_THRESHOLD = 799;
export const STANDARD_SHIPPING_CHARGE = 49;
export const FREE_SHIPPING_CHARGE = 0;

/**
 * Computes the shipping charge based on the order total.
 *
 * Rules:
 *  - If orderTotal >= ₹799  → ₹0 (free shipping)
 *  - If orderTotal < ₹799   → ₹49
 *
 * @param {number} orderTotal - The cart/order total in INR (before shipping).
 * @returns {number} The shipping charge in INR.
 */
export function computeShippingCharge(orderTotal) {
  if (typeof orderTotal !== 'number' || isNaN(orderTotal) || orderTotal < 0) {
    return STANDARD_SHIPPING_CHARGE;
  }
  return orderTotal >= FREE_SHIPPING_THRESHOLD
    ? FREE_SHIPPING_CHARGE
    : STANDARD_SHIPPING_CHARGE;
}

/**
 * Returns true if the given order total qualifies for free shipping.
 *
 * @param {number} orderTotal
 * @returns {boolean}
 */
export function isFreeShipping(orderTotal) {
  return computeShippingCharge(orderTotal) === FREE_SHIPPING_CHARGE;
}

/**
 * Returns the amount still needed to qualify for free shipping, or 0 if already qualifying.
 *
 * @param {number} orderTotal
 * @returns {number}
 */
export function amountToFreeShipping(orderTotal) {
  if (isFreeShipping(orderTotal)) return 0;
  return parseFloat((FREE_SHIPPING_THRESHOLD - orderTotal).toFixed(2));
}
