import { useEffect, useRef } from 'react';
import searchIcon from '@/assets/icons/search.svg';

/**
 * Highlights the portion of `text` that matches `query` (case-insensitive).
 */
function HighlightedText({ text, query }) {
  if (!query || !text) return <span>{text}</span>;

  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return <span>{text}</span>;

  return (
    <span>
      {text.slice(0, index)}
      <strong style={{ fontWeight: 700 }}>{text.slice(index, index + query.length)}</strong>
      {text.slice(index + query.length)}
    </span>
  );
}

/**
 * Normalises a suggestion entry to a plain string label.
 */
function getLabel(suggestion) {
  if (typeof suggestion === 'string') return suggestion;
  return suggestion.label ?? suggestion.name ?? suggestion.query ?? '';
}

export default function AutocompleteSuggestions({
  suggestions,
  isOpen,
  activeSuggestionIndex,
  onSelect,
  query,
}) {
  const listRef = useRef(null);

  // Scroll active item into view
  useEffect(() => {
    if (activeSuggestionIndex < 0 || !listRef.current) return;
    const activeEl = listRef.current.querySelector(
      `[id="search-suggestion-${activeSuggestionIndex}"]`
    );
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [activeSuggestionIndex]);

  if (!isOpen || !suggestions || suggestions.length === 0) return null;

  return (
    <ul
      ref={listRef}
      id="search-autocomplete-listbox"
      role="listbox"
      aria-label="Search suggestions"
      className="autocomplete-suggestions"
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        margin: 0,
        padding: 0,
        listStyle: 'none',
        backgroundColor: '#fff',
        border: '1px solid #d1d5db',
        borderTop: 'none',
        borderRadius: '0 0 0.375rem 0.375rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        zIndex: 1000,
        maxHeight: '20rem',
        overflowY: 'auto',
      }}
    >
      {suggestions.map((suggestion, index) => {
        const label = getLabel(suggestion);
        const isActive = index === activeSuggestionIndex;

        return (
          <li
            key={`${label}-${index}`}
            id={`search-suggestion-${index}`}
            role="option"
            aria-selected={isActive}
            className={`autocomplete-suggestions__item${isActive ? ' autocomplete-suggestions__item--active' : ''}`}
            onMouseDown={(e) => {
              // Use mousedown to prevent input blur before click
              e.preventDefault();
              onSelect(suggestion);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              cursor: 'pointer',
              backgroundColor: isActive ? '#f3f4f6' : 'transparent',
              fontSize: '0.9375rem',
              color: '#111827',
              borderBottom: index < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
            }}
          >
            <img
              src={searchIcon}
              alt=""
              aria-hidden="true"
              style={{ width: '1rem', height: '1rem', flexShrink: 0, opacity: 0.5 }}
            />
            <HighlightedText text={label} query={query} />
          </li>
        );
      })}
    </ul>
  );
}
