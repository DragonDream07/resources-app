import { useState, useEffect, useCallback, useRef } from 'react';
import searchService from '../services/searchService';

const DEBOUNCE_DELAY_MS = 300;

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);

  const search = useCallback(async (searchQuery) => {
    if (!searchQuery || !searchQuery.trim()) {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await searchService.search({ q: searchQuery });
      setResults(Array.isArray(data) ? data : (data.items || []));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuggestions = useCallback((searchQuery) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (!searchQuery || !searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    debounceTimer.current = setTimeout(async () => {
      try {
        const data = await searchService.suggest({ q: searchQuery });
        setSuggestions(Array.isArray(data) ? data : (data.suggestions || []));
      } catch (err) {
        setSuggestions([]);
      }
    }, DEBOUNCE_DELAY_MS);
  }, []);

  useEffect(() => {
    fetchSuggestions(query);
  }, [query, fetchSuggestions]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleQueryChange = useCallback((newQuery) => {
    setQuery(newQuery);
  }, []);

  const submitSearch = useCallback(() => {
    search(query);
  }, [query, search]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
  }, []);

  return {
    query,
    setQuery: handleQueryChange,
    results,
    suggestions,
    loading,
    error,
    submitSearch,
    clearSearch,
  };
}
