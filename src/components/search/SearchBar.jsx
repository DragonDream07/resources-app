import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '@/assets/icons/search.svg';
import closeIcon from '@/assets/icons/close.svg';
import AutocompleteSuggestions from './AutocompleteSuggestions';

const DEBOUNCE_DELAY = 250;

export default function SearchBar({ placeholder = 'Search products…', className = '' }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceTimer = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function fetchSuggestions(value) {
    if (!value.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`/search/suggest?q=${encodeURIComponent(value.trim())}`)
      .then((res) => {
        if (!res.ok) throw new Error('Suggest fetch failed');
        return res.json();
      })
      .then((data) => {
        const items = Array.isArray(data) ? data : data.suggestions ?? [];
        setSuggestions(items);
        setIsOpen(items.length > 0);
        setActiveSuggestionIndex(-1);
      })
      .catch(() => {
        setSuggestions([]);
        setIsOpen(false);
      })
      .finally(() => setLoading(false));
  }

  function handleInputChange(e) {
    const value = e.target.value;
    setQuery(value);

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, DEBOUNCE_DELAY);
  }

  function submitSearch(searchQuery) {
    const trimmed = (searchQuery ?? query).trim();
    if (!trimmed) return;
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleKeyDown(e) {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') submitSearch();
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
          const selected = suggestions[activeSuggestionIndex];
          const label =
            typeof selected === 'string' ? selected : selected.label ?? selected.name ?? '';
          setQuery(label);
          submitSearch(label);
        } else {
          submitSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveSuggestionIndex(-1);
        break;
      default:
        break;
    }
  }

  function handleClear() {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setActiveSuggestionIndex(-1);
    inputRef.current?.focus();
  }

  function handleSuggestionSelect(suggestion) {
    const label =
      typeof suggestion === 'string' ? suggestion : suggestion.label ?? suggestion.name ?? '';
    setQuery(label);
    submitSearch(label);
  }

  return (
    <div
      ref={containerRef}
      className={`search-bar ${className}`}
      role="search"
      style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', width: '100%' }}
    >
      <div
        className="search-bar__input-wrapper"
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          backgroundColor: '#fff',
          padding: '0 0.5rem',
        }}
      >
        <img
          src={searchIcon}
          alt=""
          aria-hidden="true"
          className="search-bar__icon search-bar__icon--search"
          style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }}
        />

        <input
          ref={inputRef}
          type="search"
          className="search-bar__input"
          value={query}
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="search-autocomplete-listbox"
          aria-activedescendant={
            activeSuggestionIndex >= 0
              ? `search-suggestion-${activeSuggestionIndex}`
              : undefined
          }
          autoComplete="off"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            padding: '0.5rem 0.25rem',
            fontSize: '1rem',
            background: 'transparent',
          }}
        />

        {query && (
          <button
            type="button"
            className="search-bar__clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              src={closeIcon}
              alt=""
              aria-hidden="true"
              style={{ width: '1rem', height: '1rem' }}
            />
          </button>
        )}

        <button
          type="button"
          className="search-bar__submit-btn"
          onClick={() => submitSearch()}
          aria-label="Submit search"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
            fontSize: '0.875rem',
            color: '#374151',
          }}
        >
          Search
        </button>
      </div>

      {loading && (
        <div
          className="search-bar__loading"
          aria-live="polite"
          style={{ fontSize: '0.75rem', color: '#6b7280', padding: '0.25rem 0.5rem' }}
        >
          Loading…
        </div>
      )}

      <AutocompleteSuggestions
        suggestions={suggestions}
        isOpen={isOpen}
        activeSuggestionIndex={activeSuggestionIndex}
        onSelect={handleSuggestionSelect}
        query={query}
      />
    </div>
  );
}
