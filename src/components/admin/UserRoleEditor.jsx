import React, { useState } from 'react';

/**
 * UserRoleEditor — Role assignment dropdown for a given user.
 * Props:
 *   userId      {string|number}
 *   currentRole {string}
 *   onSave      {function({ userId, role }): Promise<void>}
 */

const ROLES = [
  { value: 'customer', label: 'Customer' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Admin' },
];

const UserRoleEditor = ({ userId, currentRole, onSave }) => {
  const [role, setRole] = useState(currentRole || 'customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await onSave({ userId, role });
      setSuccess(true);
    } catch (err) {
      setError(err?.message || 'Failed to update role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-role-editor">
      <label
        htmlFor={`role-select-${userId}`}
        className="user-role-editor__label"
      >
        Role
      </label>
      <div className="user-role-editor__controls">
        <select
          id={`role-select-${userId}`}
          className="user-role-editor__select"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setSuccess(false);
          }}
          disabled={loading}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={handleSave}
          disabled={loading || role === currentRole}
        >
          {loading ? 'Saving…' : 'Save'}
        </button>
      </div>
      {success && <p className="form-success">Role updated successfully.</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default UserRoleEditor;
