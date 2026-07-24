import React, { useState } from 'react';

/**
 * ReturnApprovalPanel — Approve/reject return request controls with refund note.
 * Props:
 *   returnRequestId  {string|number}
 *   currentStatus    {string}
 *   onReview         {function({ returnRequestId, decision, refund_note }): Promise<void>}
 */
const ReturnApprovalPanel = ({ returnRequestId, currentStatus, onReview }) => {
  const [refundNote, setRefundNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const isResolved =
    currentStatus === 'approved' || currentStatus === 'rejected';

  const handleDecision = async (decision) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await onReview({ returnRequestId, decision, refund_note: refundNote });
      setSuccess(`Return request ${decision}.`);
    } catch (err) {
      setError(err?.message || 'Failed to process return request.');
    } finally {
      setLoading(false);
    }
  };

  if (isResolved) {
    return (
      <div className="return-approval-panel return-approval-panel--resolved">
        <p>
          This return request has been{' '}
          <strong>{currentStatus}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="return-approval-panel">
      <h3 className="return-approval-panel__title">Review Return Request</h3>

      {success && <p className="form-success">{success}</p>}
      {error && <p className="form-error">{error}</p>}

      <div className="admin-form__field">
        <label htmlFor={`refund-note-${returnRequestId}`}>Refund Note</label>
        <textarea
          id={`refund-note-${returnRequestId}`}
          className="return-approval-panel__note"
          rows={3}
          value={refundNote}
          onChange={(e) => setRefundNote(e.target.value)}
          placeholder="Optional note regarding this decision…"
          disabled={loading}
        />
      </div>

      <div className="return-approval-panel__actions">
        <button
          type="button"
          className="btn btn--success"
          onClick={() => handleDecision('approved')}
          disabled={loading}
        >
          {loading ? 'Processing…' : 'Approve'}
        </button>
        <button
          type="button"
          className="btn btn--danger"
          onClick={() => handleDecision('rejected')}
          disabled={loading}
        >
          {loading ? 'Processing…' : 'Reject'}
        </button>
      </div>
    </div>
  );
};

export default ReturnApprovalPanel;
