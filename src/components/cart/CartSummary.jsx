import React from 'react';

const formatCurrency = (amount) =>
  `₹${Number(amount).toFixed(2)}`;

const CartSummary = ({ summary }) => {
  const {
    subtotal,
    shippingCharge,
    discount,
    gst,
    grandTotal,
  } = summary;

  return (
    <div className="cart-summary">
      <h2 className="cart-summary__title">Order Summary</h2>

      <div className="cart-summary__rows">
        <div className="cart-summary__row">
          <span className="cart-summary__label">Subtotal</span>
          <span className="cart-summary__value">{formatCurrency(subtotal)}</span>
        </div>

        <div className="cart-summary__row">
          <span className="cart-summary__label">Shipping</span>
          <span className="cart-summary__value">
            {shippingCharge === 0 ? 'Free' : formatCurrency(shippingCharge)}
          </span>
        </div>

        {discount > 0 && (
          <div className="cart-summary__row cart-summary__row--discount">
            <span className="cart-summary__label">Discount</span>
            <span className="cart-summary__value cart-summary__value--discount">
              -{formatCurrency(discount)}
            </span>
          </div>
        )}

        <div className="cart-summary__row">
          <span className="cart-summary__label">GST</span>
          <span className="cart-summary__value">{formatCurrency(gst)}</span>
        </div>
      </div>

      <div className="cart-summary__divider" />

      <div className="cart-summary__row cart-summary__row--total">
        <span className="cart-summary__label cart-summary__label--total">Grand Total</span>
        <span className="cart-summary__value cart-summary__value--total">
          {formatCurrency(grandTotal)}
        </span>
      </div>
    </div>
  );
};

export default CartSummary;
