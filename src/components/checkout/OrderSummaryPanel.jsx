import React from 'react';
import ShippingBadge from './ShippingBadge';

/**
 * OrderSummaryPanel
 * Props:
 *   items: Array<{ name, quantity, price, imageUrl? }>
 *   subtotal: number
 *   discount: number     – positive amount saved
 *   shippingCharge: number  – 0 means free
 *   total: number
 *   promoCode: string | null
 *   collapsed: boolean   – hide line items, show only totals
 */
const OrderSummaryPanel = ({
  items = [],
  subtotal = 0,
  discount = 0,
  shippingCharge = 0,
  total = 0,
  promoCode = null,
  collapsed = false,
}) => {
  const fmt = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  return (
    <aside className="order-summary-panel">
      <h2 className="order-summary-panel__title">Order Summary</h2>

      <ShippingBadge shippingCharge={shippingCharge} subtotal={subtotal} />

      {!collapsed && items.length > 0 && (
        <ul className="order-summary-panel__items">
          {items.map((item, idx) => (
            <li key={idx} className="order-summary-panel__item">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="order-summary-panel__item-img"
                />
              )}
              <div className="order-summary-panel__item-info">
                <span className="order-summary-panel__item-name">{item.name}</span>
                <span className="order-summary-panel__item-qty">Qty: {item.quantity}</span>
              </div>
              <span className="order-summary-panel__item-price">{fmt(item.price)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="order-summary-panel__divider" />

      <dl className="order-summary-panel__totals">
        <div className="order-summary-panel__totals-row">
          <dt>Subtotal</dt>
          <dd>{fmt(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="order-summary-panel__totals-row order-summary-panel__totals-row--discount">
            <dt>Discount{promoCode ? ` (${promoCode})` : ''}</dt>
            <dd>− {fmt(discount)}</dd>
          </div>
        )}
        <div className="order-summary-panel__totals-row">
          <dt>Shipping</dt>
          <dd>{shippingCharge === 0 ? <span className="order-summary-panel__free">FREE</span> : fmt(shippingCharge)}</dd>
        </div>
        <div className="order-summary-panel__divider" />
        <div className="order-summary-panel__totals-row order-summary-panel__totals-row--total">
          <dt>Total</dt>
          <dd>{fmt(total)}</dd>
        </div>
      </dl>

      <style>{`
        .order-summary-panel {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 20px;
          width: 100%;
        }
        .order-summary-panel__title {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 12px 0;
        }
        .order-summary-panel__items {
          list-style: none;
          margin: 12px 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .order-summary-panel__item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .order-summary-panel__item-img {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #f3f4f6;
        }
        .order-summary-panel__item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .order-summary-panel__item-name {
          font-size: 13px;
          font-weight: 500;
          color: #111827;
          line-height: 1.3;
        }
        .order-summary-panel__item-qty {
          font-size: 12px;
          color: #6b7280;
          margin-top: 2px;
        }
        .order-summary-panel__item-price {
          font-size: 13px;
          font-weight: 600;
          color: #111827;
          white-space: nowrap;
        }
        .order-summary-panel__divider {
          height: 1px;
          background: #f3f4f6;
          margin: 12px 0;
        }
        .order-summary-panel__totals {
          margin: 0;
        }
        .order-summary-panel__totals-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          color: #374151;
        }
        .order-summary-panel__totals-row dt { font-weight: 400; }
        .order-summary-panel__totals-row dd { font-weight: 500; margin: 0; }
        .order-summary-panel__totals-row--discount dt,
        .order-summary-panel__totals-row--discount dd {
          color: #16a34a;
        }
        .order-summary-panel__totals-row--total dt,
        .order-summary-panel__totals-row--total dd {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
        }
        .order-summary-panel__free {
          color: #16a34a;
          font-weight: 600;
        }
      `}</style>
    </aside>
  );
};

export default OrderSummaryPanel;
