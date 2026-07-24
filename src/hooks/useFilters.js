import { useState, useCallback, useMemo } from 'react';

const DEFAULT_FILTERS = {
  categoryId: null,
  brandId: null,
  minPrice: null,
  maxPrice: null,
  sort: null,
  inStock: false,
};

export function useFilters(initialFilters = {}) {
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initialFilters });

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setMultipleFilters = useCallback((updates) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const clearFilter = useCallback((key) => {
    setFilters((prev) => ({ ...prev, [key]: DEFAULT_FILTERS[key] ?? null }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

  const queryParams = useMemo(() => {
    const params = {};
    if (filters.categoryId != null) params.categoryId = filters.categoryId;
    if (filters.brandId != null) params.brandId = filters.brandId;
    if (filters.minPrice != null) params.minPrice = filters.minPrice;
    if (filters.maxPrice != null) params.maxPrice = filters.maxPrice;
    if (filters.sort != null) params.sort = filters.sort;
    if (filters.inStock) params.inStock = true;
    return params;
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'inStock') return value === true;
      return value != null && value !== '';
    }).length;
  }, [filters]);

  return {
    filters,
    setFilter,
    setMultipleFilters,
    clearFilter,
    clearAllFilters,
    queryParams,
    activeFilterCount,
  };
}
