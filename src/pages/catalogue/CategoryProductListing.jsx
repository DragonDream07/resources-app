import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import emptyState from '@/assets/images/empty-state.svg';
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
  radiusMd: '10px',
  radiusSm: '6px',
};

const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
];

const PAGE_SIZE = 24;

async function fetchCategoryBySlug(slug) {
  const res = await fetch(`${API_BASE}/categories?slug=${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error('Category not found');
  const data = await res.json();
  const list = Array.isArray(data) ? data : (data.categories || data.data || []);
  const found = list.find(c => c.slug === slug);
  if (!found) throw new Error('Category not found');
  return found;
}

async function fetchCategoryProducts(categoryId, params) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', params.page);
  if (params.limit) qs.set('limit', params.limit);
  if (params.sort) qs.set('sort', params.sort);
  if (params.minPrice) qs.set('minPrice', params.minPrice);
  if (params.maxPrice) qs.set('maxPrice', params.maxPrice);
  const res = await fetch(`${API_BASE}/categories/${categoryId}/products?${qs.toString()}`);
  if (!res.ok) throw new Error('Failed to load category products');
  return res.json();
}

function ProductCard({ product }) {
  const imageUrl = product.images?.[0]?.url || placeholderProduct;
  const price = product.price ?? product.minPrice ?? 0;
  const formattedPrice = typeof price === 'number' ? `\u20B9${price.toLocaleString('en-IN')}` : price;

  return (
    <Link
      to={`/products/${product.slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: tokens.colorSurface,
        borderRadius: tokens.radiusMd,
        border: '1px solid #e9ecef',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'box-shadow 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(76,110,245,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ width: '100%', aspectRatio: '1/1', background: '#f1f3f5', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.currentTarget.src = placeholderProduct; }}
        />
      </div>
      <div style={{ padding: '12px 16px 16px' }}>
        {product.brandName && (
          <div style={{ fontSize: '12px', color: tokens.colorMuted, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{product.brandName}</div>
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

function PriceRangeFilter({ minPrice, maxPrice, onApply }) {
  const [min, setMin] = useState(minPrice || '');
  const [max, setMax] = useState(maxPrice || '');

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontWeight: 600, fontSize: '14px', color: tokens.colorInk, marginBottom: '8px' }}>Price Range</div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="number"
          placeholder="Min"
          value={min}
          onChange={e => setMin(e.target.value)}
          style={{ width: '80px', padding: '6px 8px', border: `1px solid ${tokens.colorBorder}`, borderRadius: tokens.radiusSm, fontSize: '14px', color: tokens.colorBody, outline: 'none' }}
        />
        <span style={{ color: tokens.colorMuted }}>-</span>
        <input
          type="number"
          placeholder="Max"
          value={max}
          onChange={e => setMax(e.target.value)}
          style={{ width: '80px', padding: '6px 8px', border: `1px solid ${tokens.colorBorder}`, borderRadius: tokens.radiusSm, fontSize: '14px', color: tokens.colorBody, outline: 'none' }}
        />
        <button
          onClick={() => onApply(min, max)}
          style={{ padding: '6px 12px', background: tokens.colorPrimary, color: '#fff', border: 'none', borderRadius: tokens.radiusSm, fontSize: '14px', cursor: 'pointer' }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${tokens.colorBorder}`, borderRadius: tokens.radiusSm, background: page <= 1 ? '#e9ecef' : tokens.colorSurface, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
        aria-label="Previous page"
      >
        <img src={chevronLeft} alt="" width={16} height={16} />
      </button>
      {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
        let pageNum;
        if (totalPages <= 7) pageNum = i + 1;
        else if (page <= 4) pageNum = i + 1;
        else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
        else pageNum = page - 3 + i;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${page === pageNum ? tokens.colorPrimary : tokens.colorBorder}`, borderRadius: tokens.radiusSm, background: page === pageNum ? tokens.colorPrimary : tokens.colorSurface, color: page === pageNum ? '#fff' : tokens.colorInk, fontWeight: page === pageNum ? 700 : 400, fontSize: '14px', cursor: 'pointer' }}
          >
            {pageNum}
          </button>
        );
      })}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${tokens.colorBorder}`, borderRadius: tokens.radiusSm, background: page >= totalPages ? '#e9ecef' : tokens.colorSurface, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
        aria-label="Next page"
      >
        <img src={chevronRight} alt="" width={16} height={16} />
      </button>
    </div>
  );
}

export default function CategoryProductListing() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || '';
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

  useEffect(() => {
    setCategoryError(null);
    fetchCategoryBySlug(slug)
      .then(cat => {
        setCategory(cat);
        setCategoryId(cat.id);
      })
      .catch(err => {
        setCategoryError(err.message);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    fetchCategoryProducts(categoryId, { page, limit: PAGE_SIZE, sort, minPrice, maxPrice })
      .then(data => {
        setProducts(Array.isArray(data) ? data : (data.products || data.data || []));
        setTotalCount(data.total || data.totalCount || 0);
        const tp = data.totalPages || Math.ceil((data.total || data.totalCount || 0) / PAGE_SIZE) || 1;
        setTotalPages(tp);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId, page, sort, minPrice, maxPrice]);

  if (categoryError) {
    return (
      <div style={{ minHeight: '100vh', background: tokens.colorCanvas, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: tokens.colorInk, marginBottom: '8px' }}>Category not found</div>
          <Link to="/products" style={{ color: tokens.colorPrimary, fontSize: '14px' }}>Browse all products</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: tokens.colorCanvas, fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '16px', fontSize: '13px', color: tokens.colorMuted }}>
          <Link to="/" style={{ color: tokens.colorPrimary, textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>{'/'}</span>
          <Link to="/products" style={{ color: tokens.colorPrimary, textDecoration: 'none' }}>Products</Link>
          {category && (
            <>
              <span style={{ margin: '0 8px' }}>{'/'}</span>
              <span style={{ color: tokens.colorBody }}>{category.name}</span>
            </>
          )}
        </nav>

        <h1 style={{ fontSize: '32px', fontWeight: 700, color: tokens.colorInk, letterSpacing: '-0.02em', marginBottom: '4px' }}>
          {category ? category.name : 'Loading...'}
        </h1>
        {category?.description && (
          <p style={{ fontSize: '14px', color: tokens.colorMuted, marginBottom: '8px' }}>{category.description}</p>
        )}
        <p style={{ fontSize: '14px', color: tokens.colorMuted, marginBottom: '32px' }}>
          {loading ? 'Loading...' : `${totalCount.toLocaleString('en-IN')} product${totalCount !== 1 ? 's' : ''}`}
        </p>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          {/* Sidebar */}
          <aside style={{ width: '240px', flexShrink: 0, background: tokens.colorSurface, borderRadius: tokens.radiusMd, border: '1px solid #e9ecef', padding: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: '16px', color: tokens.colorInk, marginBottom: '20px' }}>Filters</div>
            <PriceRangeFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onApply={(min, max) => {
                setSearchParams(prev => {
                  const next = new URLSearchParams(prev);
                  if (min) next.set('minPrice', min); else next.delete('minPrice');
                  if (max) next.set('maxPrice', max); else next.delete('maxPrice');
                  next.set('page', '1');
                  return next;
                });
              }}
            />
            {(minPrice || maxPrice) && (
              <button
                onClick={() => setSearchParams({ page: '1' })}
                style={{ width: '100%', padding: '8px', background: 'none', border: `1px solid ${tokens.colorBorder}`, borderRadius: tokens.radiusSm, fontSize: '13px', color: tokens.colorError, cursor: 'pointer', marginTop: '8px' }}
              >
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Main */}
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
              <div style={{ padding: '16px', background: '#ffe3e3', borderRadius: tokens.radiusSm, color: tokens.colorError, marginBottom: '20px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} style={{ background: '#e9ecef', borderRadius: tokens.radiusMd, aspectRatio: '3/4' }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <img src={emptyState} alt="No products" style={{ width: '120px', marginBottom: '16px', opacity: 0.7 }} />
                <div style={{ fontSize: '18px', fontWeight: 600, color: tokens.colorInk, marginBottom: '8px' }}>No products in this category</div>
                <div style={{ fontSize: '14px', color: tokens.colorMuted }}>Check back later or browse other categories.</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </main>
        </div>
      </div>
    </div>
  );
}
