import React from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const buildPages = () => {
    const totalPageNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 ellipses
    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);
    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftRange = range(1, 3 + siblingCount * 2);
      return [...leftRange, '...', totalPages];
    }
    if (showLeftDots && !showRightDots) {
      const rightRange = range(totalPages - (2 + siblingCount * 2), totalPages);
      return [1, '...', ...rightRange];
    }
    const middleRange = range(leftSibling, rightSibling);
    return [1, '...', ...middleRange, '...', totalPages];
  };

  const pages = buildPages();

  const btnBase =
    'inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-md px-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1';

  const pageBtn = (page) => [
    btnBase,
    page === currentPage
      ? 'bg-blue-600 text-white pointer-events-none'
      : 'text-gray-700 hover:bg-gray-100',
  ].join(' ');

  const navBtn = (disabled) => [
    btnBase,
    disabled
      ? 'text-gray-300 cursor-not-allowed'
      : 'text-gray-700 hover:bg-gray-100',
  ].join(' ');

  return (
    <nav aria-label="Pagination" className={`flex items-center gap-1 ${className}`}>
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={navBtn(currentPage === 1)}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="inline-flex h-9 min-w-[2.25rem] items-center justify-center text-sm text-gray-400"
            aria-hidden="true"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            onClick={() => page !== currentPage && onPageChange(page)}
            className={pageBtn(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={navBtn(currentPage === totalPages)}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;
