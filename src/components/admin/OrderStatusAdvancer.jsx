import React, { useState } from 'react';

const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

/**
 * OrderStatusAdvancer — Dropdown/button to advance order status; role-gated.
 * Props:
 *   orderId      {string|number}
 *   currentStatus {string}
 *   userRole     {string}  — 'admin' | 'manager' | other
 *   onAdvance    {function(orderId, newStatus): Promise<void>}
 */
const ALLOWED_ROLES = ['admin', 'manager'];

const OrderStatusAdvancer = ({ orderId, currentStatus, userRole, onAdvance }) => {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!ALLOWED_ROLES.includes(userRole)) {
    return null;
  }

  const nextStatuses = STATUS_TRANSITIONS[currentStatus] || [];

  if (nextStatuses.length === 0) {
    return (
      <p className="order-status-advancer__no-action">
        No further status transitions available.
      </p>
    );
  }

  const handleAdvance = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      await onAdvance(orderId, selected);
      setSelected('');
    } catch (err) {
      setError(err?.message || 'Failed to advance order status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-status-advancer">
      <label
        htmlFor={`status-select-${orderId}`}
        className="order-status-advancer__label"
      >
        Advance Status
      </label>
      <div className="order-status-advancer__controls">
        <select
          id={`status-select-${orderId}`}
          className="order-status-advancer__select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          disabled={loading}
        >
          <option value="">Select next status…</option>
          {nextStatuses.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <button
          className="order-status-advancer__btn btn btn--primary"
          onClick={handleAdvance}
          disabled={!selected || loading}
        >
          {loading ? 'Updating…' : 'Advance'}
        </button>
      </div>
      {error && (
        <p className="order-status-advancer__error form-error">{error}</p>
      )}
    </div>
  );
};

export default OrderStatusAdvancer;
