import React from 'react';

const STATUS_BADGE_STYLES = {
  confirmed: 'bg-blue-100 text-blue-800',
  packed: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-800',
};

const STATUS_LABELS = {
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
};

function StatusBadge({ status }) {
  const style = STATUS_BADGE_STYLES[status] || 'bg-gray-100 text-gray-800';
  const label = STATUS_LABELS[status] || status;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}

function OrderCard({ order, onClick }) {
  const {
    orderId,
    orderNumber,
    createdAt,
    status,
    totalAmount,
    itemCount,
    currency = 'INR',
  } = order;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

  const formattedAmount =
    totalAmount !== undefined && totalAmount !== null
      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(totalAmount)
      : '—';

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick && onClick(orderId)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick(orderId)}
      aria-label={`Order ${orderNumber || orderId}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Order ID</p>
          <p className="text-sm font-semibold text-gray-900 font-mono">
            {orderNumber || orderId}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{formattedDate}</span>
        {itemCount !== undefined && (
          <span>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
        <span className="text-sm text-gray-500">Total</span>
        <span className="text-sm font-semibold text-gray-900">{formattedAmount}</span>
      </div>
    </div>
  );
}

export default OrderCard;
