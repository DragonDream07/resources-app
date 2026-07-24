import { useState, useCallback, useMemo } from 'react';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export function usePagination({ initialPage = DEFAULT_PAGE, initialLimit = DEFAULT_LIMIT, total = 0 } = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const totalPages = useMemo(() => {
    if (!total || !limit) return 1;
    return Math.ceil(total / limit);
  }, [total, limit]);

  const goToPage = useCallback((newPage) => {
    if (newPage < 1) return;
    if (totalPages > 0 && newPage > totalPages) return;
    setPage(newPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  const queryParams = useMemo(() => ({
    page,
    limit,
  }), [page, limit]);

  return {
    page,
    limit,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    changeLimit,
    reset,
    queryParams,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
