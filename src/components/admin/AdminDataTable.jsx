import React, { useState, useMemo } from 'react';

/**
 * AdminDataTable — Reusable sortable/paginated table for admin list views.
 *
 * Props:
 *   columns      {Array<{ key, label, sortable?, render? }>}
 *   rows         {Array<object>}
 *   pageSize     {number}  default 20
 *   emptyMessage {string}
 *   actions      {function(row): React.ReactNode}  — optional per-row actions
 */

const DEFAULT_PAGE_SIZE = 20;

const AdminDataTable = ({
  columns = [],
  rows = [],
  pageSize = DEFAULT_PAGE_SIZE,
  emptyMessage = 'No records found.',
  actions,
}) => {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      const cmp = aVal < bVal ? -1 : 1;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedRows = sortedRows.slice(start, start + pageSize);

  const hasActions = typeof actions === 'function';

  return (
    <div className="admin-data-table-wrapper">
      <table className="admin-data-table">
        <thead className="admin-data-table__head">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`admin-data-table__th${
                  col.sortable ? ' admin-data-table__th--sortable' : ''
                }${
                  sortKey === col.key
                    ? ` admin-data-table__th--${sortDir}`
                    : ''
                }`}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                style={col.sortable ? { cursor: 'pointer' } : undefined}
              >
                {col.label}
                {col.sortable && sortKey === col.key && (
                  <span className="admin-data-table__sort-indicator">
                    {sortDir === 'asc' ? ' ▲' : ' ▼'}
                  </span>
                )}
              </th>
            ))}
            {hasActions && (
              <th className="admin-data-table__th admin-data-table__th--actions">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="admin-data-table__body">
          {pagedRows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (hasActions ? 1 : 0)}
                className="admin-data-table__empty"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            pagedRows.map((row, rowIndex) => (
              <tr key={row.id ?? rowIndex} className="admin-data-table__row">
                {columns.map((col) => (
                  <td key={col.key} className="admin-data-table__td">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {hasActions && (
                  <td className="admin-data-table__td admin-data-table__td--actions">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="admin-data-table__pagination">
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          ‹ Prev
        </button>
        <span className="admin-data-table__page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next ›
        </button>
      </div>
    </div>
  );
};

export default AdminDataTable;
