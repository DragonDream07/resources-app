import React from 'react';

const FREE_SHIPPING_THRESHOLD = 499;

/**
 * ShippingBadge
 * Props:
 *   shippingCharge: number  – 0 means free shipping applied
 *   subtotal: number        – cart subtotal before discount
 */
const ShippingBadge = ({ shippingCharge = 0, subtotal = 0 }) => {
  const isFree = shippingCharge === 0;
  const amountNeeded = FREE_SHIPPING_THRESHOLD - subtotal;

  if (isFree) {
    return (
      <div className="shipping-badge shipping-badge--free">
        <span className="shipping-badge__icon" aria-hidden="true">🚚</span>
        <span className="shipping-badge__text">You've got <strong>FREE delivery</strong> on this order!</span>

        <style>{`
          .shipping-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 13px;
            margin-bottom: 12px;
          }
          .shipping-badge--free {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #15803d;
          }
          .shipping-badge--charge {
            background: #fff7ed;
            border: 1px solid #fed7aa;
            color: #c2410c;
          }
          .shipping-badge--almost {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            color: #1d4ed8;
          }
          .shipping-badge__icon { font-size: 16px; }
          .shipping-badge__text { line-height: 1.4; }
          .shipping-badge__text strong { font-weight: 700; }
        `}</style>
      </div>
    );
  }

  if (amountNeeded > 0) {
    const fmt = (n) =>
      new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

    return (
      <div className="shipping-badge shipping-badge--almost">
        <span className="shipping-badge__icon" aria-hidden="true">🚚</span>
        <span className="shipping-badge__text">
          Add <strong>{fmt(amountNeeded)}</strong> more for <strong>FREE delivery</strong>
        </span>

        <style>{`
          .shipping-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 13px;
            margin-bottom: 12px;
          }
          .shipping-badge--free {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #15803d;
          }
          .shipping-badge--charge {
            background: #fff7ed;
            border: 1px solid #fed7aa;
            color: #c2410c;
          }
          .shipping-badge--almost {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            color: #1d4ed8;
          }
          .shipping-badge__icon { font-size: 16px; }
          .shipping-badge__text { line-height: 1.4; }
          .shipping-badge__text strong { font-weight: 700; }
        `}</style>
      </div>
    );
  }

  const fmtCharge = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="shipping-badge shipping-badge--charge">
      <span className="shipping-badge__icon" aria-hidden="true">🚚</span>
      <span className="shipping-badge__text">
        Shipping charge: <strong>{fmtCharge(shippingCharge)}</strong>
      </span>

      <style>{`
        .shipping-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 13px;
          margin-bottom: 12px;
        }
        .shipping-badge--free {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
        }
        .shipping-badge--charge {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #c2410c;
        }
        .shipping-badge--almost {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1d4ed8;
        }
        .shipping-badge__icon { font-size: 16px; }
        .shipping-badge__text { line-height: 1.4; }
        .shipping-badge__text strong { font-weight: 700; }
      `}</style>
    </div>
  );
};

export default ShippingBadge;
