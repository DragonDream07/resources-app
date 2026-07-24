import React from 'react';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

function OrderItemsList({ items, currency = 'INR' }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">No items found in this order.</div>
    );
  }

  const formatPrice = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Product
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Qty
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Unit Price
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {items.map((item) => {
            const {
              orderItemId,
              productName,
              skuLabel,
              imageUrl,
              quantity,
              unitPrice,
              subtotal,
            } = item;

            const displaySubtotal =
              subtotal !== undefined ? subtotal : (unitPrice || 0) * (quantity || 0);

            return (
              <tr key={orderItemId || productName} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={imageUrl || placeholderProduct}
                      alt={productName || 'Product'}
                      className="w-12 h-12 object-cover rounded border border-gray-100 flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = placeholderProduct;
                      }}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {productName || '—'}
                      </p>
                      {skuLabel && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{skuLabel}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-gray-700">{quantity ?? '—'}</td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {unitPrice !== undefined ? formatPrice(unitPrice) : '—'}
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {formatPrice(displaySubtotal)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OrderItemsList;
