import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import emptyState from '@/assets/images/empty-state.svg';
import searchIcon from '@/assets/icons/search.svg';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';
import chevronDown from '@/assets/icons/chevron-down.svg';

const API_BASE = import.meta.env.VITE_API_BASE || '';

const tokens = {
  colorPrimary: '#4c6ef5',
  colorPrimaryDark: '#3b5bdb',
  colorPrimarySubtle: '#e8ecfd',
  colorCanvas: '#f8f9fa',
  colorSurface: '#ffffff',
  colorInk: '#212529',
  colorBody: '#343a40',
  colorMuted: '#495057',
  colorBorder: '#868e96',
  colorError: '#f03e3e',
  colorSuccess: '#37b24d',
  radiusMd: '10px',
  radiusSm: '6px',
  radiusXs: '3px',
};

const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
];

const PAGE_SIZE = 24;

async function fetchSearchResults(params) {
  const qs = new URLSearchParams();
  if (params.q) qs.set('q', params.q);
  if (params.page) qs.set('page', params.page);
  if (params.limit) qs.set('limit', params.limit);
  if (params.sort) qs.set('sort', params.sort);
  if (params.brand) qs.set('brand', params.brand);
  if (params.category) qs.set('category', params.category);
  if (params.minPrice) qs.set('minPrice', params.minPrice);
  if (params.maxPrice) qs.set('maxPrice', params.maxPrice);
  const res = await fetch(`${API_BASE}/search?${qs.toString()}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

async function fetchSuggest(q) {
  const qs = new URLSearchParams({ q });
  const res = await fetch(`${API_BASE}/search/suggest?${qs.toString()}`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : (data.suggestions || []);
}

async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : (data.categories || data.data || []);
}

async function fetchBrands() {
  const res = await fetch(`${API_BASE}/brands`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : (data.brands || []);
}

function ProductCard({ product }) {
  const imageUrl = product.images?.[0]?.url || placeholderProduct;
  const price = product.price ?? product.minPrice ?? 0;
  const formattedPrice = typeof price === 'number' ? `\u20B9${price.toLocaleString('en-IN')}` : price;

  return (
    <Link
      to={`/products/${product.slug}`}
      style={{ display: 'flex', flexDirection: 'column', background: tokens.colorSurface, borderRadius: tokens.radiusMd, border: '1px solid #e9ecef', overflow: 'hidden', textDecoration: 'none', color: 'inherit', transition: 'box-shadow 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(76,110,245,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ width: '100%', aspectRatio: '1/1', background: '#f1f3f5', overflow: 'hidden' }}>
        <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.src = placeholderProduct; }} />
      </div>
      <div style={{ padding: '12px 16px 16px' }}>
        {product.brandName && (
          <div style={{ fontSize: '12px', color: tokens.colorMuted, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{product.brandName}</div>
        )}
        {product.categoryName && (
          <div style={{ fontSize: '11px', color: tokens.colorPrimary, marginBottom: '4px', background: tokens.colorPrimarySubtle, display: 'inline-block', padding: '2px 6px', borderRadius: tokens.radiusXs }}>{product.categoryName}</div>
        )}
        <div style={{ fontSize: '14px', fontWeight: 600, color: tokens.colorInk, marginBottom: '6px', lineHeight: '1.4' }}>{product.name}</div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: tokens.colorPrimary }}>{formattedPrice}</div>
        {product.taxLabel && (
          <div style={{ fontSize: '12px', color: tokens.colorMuted, marginTop: '2px' }}>{product.taxLabel}</div>
        )}
      </div>
    </Link>
  );
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${tokens.colorBorder}`, borderRadius: tokens.radiusSm, background: page <= 1 ? '#e9ecef' : tokens.colorSurface, cursor: page <= 1 ? 'not-allowed' : 'pointer' }} aria-label="Previous page">
        <img src={chevronLeft} alt="" width={16} height={16} />
      </button>
      {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
        let pageNum;
        if (totalPages <= 7) pageNum = i + 1;
        else if (page <= 4) pageNum = i + 1;
        else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
        else pageNum = page - 3 + i;
        return (
          <button key={pageNum} onClick={() => onPageChange(pageNum)} style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${page === pageNum ? tokens.colorPrimary : tokens.colorBorder}`, borderRadius: tokens.radiusSm, background: page === pageNum ? tokens.colorPrimary : tokens.colorSurface, color: page === pageNum ? '#fff' : tokens.colorInk, fontWeight: page === pageNum ? 700 : 400, fontSize: '14px', cursor: 'pointer' }}>
            {pageNum}
          </button>
        );
      })}
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${tokens.colorBorder}`, borderRadius: tokens.radiusSm, background: page >= totalPages ? '#e9ecef' : tokens.colorSurface, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }} aria-label="Next page">
        <img src={chevronRight} alt="" width={16} height={16} />
      </button>
    </div>
  );
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [facets, setFacets] = useState({ brands: [], categories: [] });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const suggestTimer = useRef(null);
  const inputRef = useRef(null);

  const q = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || '';
  const brand = searchParams.get('brand') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const updateParam = useCallback((key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value); else next.delete(key);
      next.set('page', '1');
      return next;
    });
  }, [setSearchParams]);

  const handlePageChange = useCallback((newPage) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setSearchParams]);

  const handleSearch = useCallback((value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value.trim()) next.set('q', value.trim()); else next.delete('q');
      next.set('page', '1');
      return next;
    });
    setShowSuggestions(false);
  }, [setSearchParams]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    clearTimeout(suggestTimer.current);
    if (val.trim().length >= 2) {
      suggestTimer.current = setTimeout(() => {
        fetchSuggest(val.trim()).then(s => { setSuggestions(s); setShowSuggestions(true); }).catch(() => {});
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    setInputValue(q);
  }, [q]);

  useEffect(() => {
    fetchBrands().then(setBrands).catch(() => {});
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setTotalCount(0);
      setTotalPages(1);
      return;
    }
    setLoading(true);
    setError(null);
    fetchSearchResults({ q, page, limit: PAGE_SIZE, sort, brand, category, minPrice, maxPrice })
      .then(data => {
        setResults(Array.isArray(data) ? data : (data.products || data.results || data.data || []));
        setTotalCount(data.total || data.totalCount || 0);
        const tp = data.totalPages || Math.ceil((data.total || data.totalCount || 0) / PAGE_SIZE) || 1;
        setTotalPages(tp);
        if (data.facets) setFacets(data.facets);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [q, page, sort, brand, category, minPrice, maxPrice]);

  const activeBrands = facets.brands?.length ? facets.brands : brands;
  const activeCategories = facets.categories?.length ? facets.categories : categories;

  return (
    <div style={{ minHeight: '100vh', background: tokens.colorCanvas, fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: tokens.colorInk, letterSpacing: '-0.02em', marginBottom: '20px' }}>Search Results</h1>
          <div style={{ position: 'relative', maxWidth: '640px' }}>
            <input
              ref={inputRef}
              type="search"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(inputValue); }}
              onFocus={() => { if (suggestions.length) setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search products..."
              aria-label="Search products"
              style={{
                width: '100%',
                padding: '12px 48px 12px 16px',
                fontSize: '16px',
                border: `1px solid ${tokens.colorBorder}`,
                borderRadius: tokens.radiusSm,
                outline: 'none',
                color: tokens.colorBody,
                background: tokens.colorSurface,
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={() => handleSearch(inputValue)}
              style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tokens.colorPrimary, border: 'none', borderRadius: tokens.radiusSm, cursor: 'pointer' }}
              aria-label="Search"
            >
              <img src={searchIcon} alt="" width={18} height={18} style={{ filter: 'brightness(0) invert(1)' }} />
            </button>
            {showSuggestions && suggestions.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: tokens.colorSurface, border: `1px solid ${tokens.colorBorder}`, borderRadius: tokens.radiusSm, boxShadow: '0 8px 24px rgba(33,37,41,0.12)', zIndex: 100, marginTop: '4px' }}>
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onMouseDown={() => { setInputValue(typeof s === 'string' ? s : s.text || s.query || ''); handleSearch(typeof s === 'string' ? s : s.text || s.query || ''); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: tokens.colorBody, textAlign: 'left' }}
                  >
                    <img src={searchIcon} alt="" width={14} height={14} style={{ opacity: 0.5 }} />
                    {typeof s === 'string' ? s : s.text || s.query || ''}
                  </button>
                ))}
              </div>
            )}
          </div>
          {q && !loading && (
            <p style={{ fontSize: '14px', color: tokens.colorMuted, marginTop: '12px' }}>
              <strong style={{ color: tokens.colorInk }}>{totalCount.toLocaleString('en-IN')}</strong> result{totalCount !== 1 ? 's' : ''} for &ldquo;<strong style={{ color: tokens.colorInk }}>{q}</strong>&rdquo;
            </p>
          )}
        </div>

        {q ? (
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            {/* Facet Sidebar */}
            <aside style={{ width: '240px', flexShrink: 0, background: tokens.colorSurface, borderRadius: tokens.radiusMd, border: '1px solid #e9ecef', padding: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '16px', color: tokens.colorInk, marginBottom: '20px' }}>Filters</div>

              {activeCategories.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: tokens.colorInk, marginBottom: '8px' }}>Category</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: tokens.colorBody }}>
                      <input type="radio" name="category" value="" checked={!category} onChange={() => updateParam('category', '')} />
                      All Categories
                    </label>
                    {activeCategories.map(cat => (
                      <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: tokens.colorBody }}>
                        <input type="radio" name="category" value={cat.id} checked={category === String(cat.id)} onChange={() => updateParam('category', String(cat.id))} />
                        {cat.name}{cat.count != null ? ` (${cat.count})` : ''}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {activeCategories.length > 0 && activeBrands.length > 0 && (
                <hr style={{ border: 'none', borderTop: '1px solid #e9ecef', margin: '16px 0' }} />
              )}

              {activeBrands.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: tokens.colorInk, marginBottom: '8px' }}>Brand</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: tokens.colorBody }}>
                      <input type="radio" name="brand" value="" checked={!brand} onChange={() => updateParam('brand', '')} />
                      All Brands
                    </label>
                    {activeBrands.map(b => (
                      <label key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: tokens.colorBody }}>
                        <input type="radio" name="brand" value={b.id} checked={brand === String(b.id)} onChange={() => updateParam('brand', String(b.id))} />
                        {b.name}{b.count != null ? ` (${b.count})` : ''}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <hr style={{ border: 'none', borderTop: '1px solid #e9ecef', margin: '16px 0' }} />

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: tokens.colorInk, marginBottom: '8px' }}>Price Range</div>
                <PriceFilter minPrice={minPrice} maxPrice={maxPrice} onApply={(min, max) => {
                  setSearchParams(prev => {
                    const next = new URLSearchParams(prev);
                    if (min) next.set('minPrice', min); else next.delete('minPrice');
                    if (max) next.set('maxPrice', max); else next.delete('maxPrice');
                    next.set('page', '1');
                    return next;
                  });
                }} />
              </div>

              {(brand || category || minPrice || maxPrice) && (
                <button
                  onClick={() => setSearchParams({ q, page: '1' })}
                  style={{ width: '100%', padding: '8px', background: 'none', border: `1px solid ${tokens.colorBorder}`, borderRadius: tokens.radiusSm, fontSize: '13px', color: tokens.colorError, cursor: 'pointer', marginTop: '8px' }}
                >
                  Clear All Filters
                </button>
              )}
            </aside>

            {/* Results */}
            <main style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '20px', gap: '12px' }}>
                <label htmlFor="sort-select" style={{ fontSize: '14px', color: tokens.colorMuted }}>Sort by:</label>
                <div style={{ position: 'relative' }}>
                  <select
                    id="sort-select"
                    value={sort}
                    onChange={e => updateParam('sort', e.target.value)}
                    style={{ padding: '8px 36px 8px 12px', border: `1px solid ${tokens.colorBorder}`, borderRadius: tokens.radiusSm, fontSize: '14px', color: tokens.colorBody, background: tokens.colorSurface, appearance: 'none', cursor: 'pointer', outline: 'none' }}
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <img src={chevronDown} alt="" width={16} height={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>

              {error && (
                <div style={{ padding: '16px', background: '#ffe3e3', borderRadius: tokens.radiusSm, color: tokens.colorError, marginBottom: '20px', fontSize: '14px' }}>{error}</div>
              )}

              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} style={{ background: '#e9ecef', borderRadius: tokens.radiusMd, aspectRatio: '3/4' }} />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 0' }}>
                  <img src={emptyState} alt="No results" style={{ width: '120px', marginBottom: '16px', opacity: 0.7 }} />
                  <div style={{ fontSize: '18px', fontWeight: 600, color: tokens.colorInk, marginBottom: '8px' }}>No results found</div>
                  <div style={{ fontSize: '14px', color: tokens.colorMuted }}>Try different keywords or adjust your filters.</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                  {results.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </main>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <img src={emptyState} alt="" style={{ width: '120px', marginBottom: '16px', opacity: 0.5 }} />
            <div style={{ fontSize: '18px', fontWeight: 600, color: tokens.colorInk, marginBottom: '8px' }}>Start searching</div>
            <div style={{ fontSize: '14px', color: tokens.colorMuted }}>Enter a keyword above to find products.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function PriceFilter({ minPrice, maxPrice, onApply }) {
  const [min, setMin] = useState(minPrice || '');
  const [max, setMax] = useState(maxPrice || '');
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <input type="number" placeholder="Min" value={min} onChange={e => setMin(e.target.value)} style={{ width: '72px', padding: '6px 8px', border: `1px solid ${tokens.colorBorder}`, borderRadius: tokens.radiusSm, fontSize: '13px', outline: 'none' }} />
      <span style={{ color: tokens.colorMuted }}>-</span>
      <input type="number" placeholder="Max" value={max} onChange={e => setMax(e.target.value)} style={{ width: '72px', padding: '6px 8px', border: `1px solid ${tokens.colorBorder}`, borderRadius: tokens.radiusSm, fontSize: '13px', outline: 'none' }} />
      <button onClick={() => onApply(min, max)} style={{ padding: '6px 10px', background: tokens.colorPrimary, color: '#fff', border: 'none', borderRadius: tokens.radiusSm, fontSize: '13px', cursor: 'pointer' }}>Apply</button>
    </div>
  );
}
