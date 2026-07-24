import React, { useState } from 'react';

function CancelOrderButton({ orderId, onCancel, isEligible = true, loading: externalLoading }) {
  const [showDialog, setShowDialog] = useState(false);
  const [reason, setReason] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);

  const loading = externalLoading || internalLoading;

  if (!isEligible) {
    return null;
  }

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleClose = () => {
    if (loading) return;
    setShowDialog(false);
    setReason('');
  };

  const handleConfirm = async () => {
    if (loading) return;
    setInternalLoading(true);
    try {
      if (onCancel) {
        await onCancel({ orderId, reason: reason.trim() || undefined });
      }
      setShowDialog(false);
      setReason('');
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenDialog}
        className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-colors"
        aria-label="Cancel this order"
      >
        Cancel Order
      </button>

      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-dialog-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
            <div>
              <h2
                id="cancel-dialog-title"
                className="text-lg font-semibold text-gray-900"
              >
                Cancel Order
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
            </div>

            <div>
              <label
                htmlFor="cancel-reason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reason (optional)
              </label>
              <textarea
                id="cancel-reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us why you'd like to cancel..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 justify-end pt-1">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                {loading ? 'Cancelling…' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CancelOrderButton;
