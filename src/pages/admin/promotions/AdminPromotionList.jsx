import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import editIcon from '@/assets/icons/edit.svg';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';

export default function AdminPromotionList() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  async function fetchPromoCodes() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/promo-codes', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to load promo codes');
      const data = await res.json();
      setPromoCodes(data.items ?? data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/promo-codes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete promo code');
      setPromoCodes((prev) => prev.filter((p) => p.id !== id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  function formatDiscount(promo) {
    if (promo.type === 'percentage') return `${promo.discount}%`;
    if (promo.type === 'fixed') return `$${Number(promo.discount).toFixed(2)}`;
    return promo.discount;
  }

  function formatExpiry(expiry) {
    if (!expiry) return '—';
    return new Date(expiry).toLocaleDateString();
  }

  function isExpired(expiry) {
    if (!expiry) return false;
    return new Date(expiry) < new Date();
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Promo Codes</h1>
        <Link to="/admin/promotions/new" className="btn btn--primary">
          <img src={plusIcon} alt="" className="btn__icon" />
          New Promo Code
        </Link>
      </div>

      {loading && (
        <div className="admin-page__loading" aria-live="polite">
          Loading promo codes…
        </div>
      )}

      {error && (
        <div className="admin-page__error" role="alert">
          {error}
          <button className="btn btn--secondary" onClick={fetchPromoCodes}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && promoCodes.length === 0 && (
        <div className="admin-page__empty">
          <img src="@/assets/images/empty-state.svg" alt="No promo codes" className="admin-page__empty-img" />
          <p>No promo codes found. Create one to get started.</p>
        </div>
      )}

      {!loading && !error && promoCodes.length > 0 && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Discount</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promo) => (
                <tr key={promo.id}>
                  <td>
                    <span className="promo-code__badge">{promo.code}</span>
                  </td>
                  <td className="promo-code__type">
                    {promo.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                  </td>
                  <td>{formatDiscount(promo)}</td>
                  <td>{formatExpiry(promo.expiry)}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        isExpired(promo.expiry)
                          ? 'status-badge--expired'
                          : promo.active
                          ? 'status-badge--active'
                          : 'status-badge--inactive'
                      }`}
                    >
                      {isExpired(promo.expiry)
                        ? 'Expired'
                        : promo.active
                        ? 'Active'
                        : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <Link
                        to={`/admin/promotions/${promo.id}/edit`}
                        className="icon-btn icon-btn--edit"
                        aria-label={`Edit ${promo.code}`}
                      >
                        <img src={editIcon} alt="Edit" />
                      </Link>
                      <button
                        className="icon-btn icon-btn--delete"
                        aria-label={`Delete ${promo.code}`}
                        onClick={() => setDeleteTarget(promo)}
                      >
                        <img src={trashIcon} alt="Delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
          <div className="modal">
            <h2 id="delete-modal-title" className="modal__title">Delete Promo Code</h2>
            <p className="modal__body">
              Are you sure you want to delete <strong>{deleteTarget.code}</strong>? This action cannot be undone.
            </p>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn--danger"
                onClick={() => handleDelete(deleteTarget.id)}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
