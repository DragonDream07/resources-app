import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import cartIcon from '@/assets/icons/cart.svg';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';
import starIcon from '@/assets/icons/star.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';

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
  colorErrorSubtle: '#ffe3e3',
  colorSuccess: '#37b24d',
  colorSuccessSubtle: '#d3f9d8',
  colorSecondary: '#fd7e14',
  colorSecondarySubtle: '#fff3e6',
  colorDisabledBg: '#e9ecef',
  colorDisabledText: '#adb5bd',
  radiusMd: '10px',
  radiusSm: '6px',
  radiusXs: '3px',
  radiusFull: '9999px',
};

async function fetchProduct(slug) {
  const res = await fetch(`${API_BASE}/products/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

async function fetchProductSkus(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}/skus`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : (data.skus || []);
}

async function fetchProductImages(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}/images`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : (data.images || []);
}

async function addToCart(cartId, skuId, quantity) {
  const res = await fetch(`${API_BASE}/carts/${cartId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skuId, quantity }),
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to add to cart');
  }
  return res.json();
}

async function getOrCreateCart() {
  let cartId = localStorage.getItem('cartId');
  if (cartId) {
    const res = await fetch(`${API_BASE}/carts/${cartId}`, { credentials: 'include' });
    if (res.ok) return cartId;
  }
  const res = await fetch(`${API_BASE}/auth/guest-register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
    credentials: 'include',
  });
  if (res.ok) {
    const data = await res.json();
    cartId = data.cartId || data.cart?.id;
    if (cartId) {
      localStorage.setItem('cartId', cartId);
      return cartId;
    }
  }
  cartId = `guest-${Date.now()}`;
  localStorage.setItem('cartId', cartId);
  return cartId;
}

function ImageGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const validImages = images && images.length > 0 ? images : [{ url: placeholderProduct }];

  const goPrev = () => setActiveIndex(i => (i - 1 + validImages.length) % validImages.length);
  const goNext = () => setActiveIndex(i => (i + 1) % validImages.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Main image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: '#f1f3f5', borderRadius: tokens.radiusMd, overflow: 'hidden' }}>
        <img
          src={validImages[activeIndex]?.url || placeholderProduct}
          alt={`${productName} - image ${activeIndex + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onError={e => { e.currentTarget.src = placeholderProduct; }}
        />
        {validImages.length > 1 && (
          <>
            <button
              onClick={goPrev}
              style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.9)', border: '1px solid #e9ecef', borderRadius: tokens.radiusFull, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              aria-label="Previous image"
            >
              <img src={chevronLeft} alt="" width={16} height={16} />
            </button>
            <button
              onClick={goNext}
              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.9)', border: '1px solid #e9ecef', borderRadius: tokens.radiusFull, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              aria-label="Next image"
            >
              <img src={chevronRight} alt="" width={16} height={16} />
            </button>
          </>
        )}
      </div>
      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {validImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: tokens.radiusSm,
                border: `2px solid ${idx === activeIndex ? tokens.colorPrimary : '#e9ecef'}`,
                overflow: 'hidden',
                cursor: 'pointer',
                padding: 0,
                background: '#f1f3f5',
                flexShrink: 0,
              }}
              aria-label={`View image ${idx + 1}`}
              aria-pressed={idx === activeIndex}
            >
              <img src={img.url || placeholderProduct} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.src = placeholderProduct; }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function VariantAttribute({ label, values, selected, onSelect }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, color: tokens.colorInk, marginBottom: '8px' }}>
        {label}: <span style={{ fontWeight: 400, color: tokens.colorMuted }}>{selected}</span>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {values.map(val => (
          <button
            key={val}
            onClick={() => onSelect(val)}
            style={{
              padding: '6px 14px',
              border: `2px solid ${selected === val ? tokens.colorPrimary : tokens.colorBorder}`,
              borderRadius: tokens.radiusSm,
              background: selected === val ? tokens.colorPrimarySubtle : tokens.colorSurface,
              color: selected === val ? tokens.colorPrimary : tokens.colorBody,
              fontSize: '14px',
              fontWeight: selected === val ? 600 : 400,
              cursor: 'pointer',
              minHeight: '44px',
              transition: 'border-color 0.1s, background 0.1s',
            }}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuantitySelector({ quantity, onChange, maxStock }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: `1px solid ${tokens.colorBorder}`, borderRadius: tokens.radiusSm, width: 'fit-content', overflow: 'hidden' }}>
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: quantity <= 1 ? tokens.colorDisabledBg : tokens.colorSurface, border: 'none', cursor: quantity <= 1 ? 'not-allowed' : 'pointer', borderRight: `1px solid ${tokens.colorBorder}` }}
        aria-label="Decrease quantity"
      >
        <img src={minusIcon} alt="" width={16} height={16} />
      </button>
      <div style={{ width: '48px', textAlign: 'center', fontSize: '16px', fontWeight: 600, color: tokens.colorInk, userSelect: 'none' }}>{quantity}</div>
      <button
        onClick={() => onChange(Math.min(maxStock || 99, quantity + 1))}
        disabled={maxStock != null && quantity >= maxStock}
        style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: (maxStock != null && quantity >= maxStock) ? tokens.colorDisabledBg : tokens.colorSurface, border: 'none', cursor: (maxStock != null && quantity >= maxStock) ? 'not-allowed' : 'pointer', borderLeft: `1px solid ${tokens.colorBorder}` }}
        aria-label="Increase quantity"
      >
        <img src={plusIcon} alt="" width={16} height={16} />
      </button>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [skus, setSkus] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedSku, setSelectedSku] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [cartError, setCartError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    setLoading(true);
    setError(null);
    setCartSuccess(false);
    setCartError(null);
    setQuantity(1);
    setSelectedAttributes({});
    setSelectedSku(null);

    fetchProduct(slug)
      .then(async data => {
        const prod = data.product || data;
        setProduct(prod);
        const [fetchedSkus, fetchedImages] = await Promise.all([
          fetchProductSkus(prod.id),
          fetchProductImages(prod.id),
        ]);
        setSkus(fetchedSkus);
        setImages(fetchedImages.length ? fetchedImages : (prod.images || []));
        if (fetchedSkus.length > 0) {
          setSelectedSku(fetchedSkus[0]);
          const attrs = {};
          if (fetchedSkus[0].attributes) {
            Object.entries(fetchedSkus[0].attributes).forEach(([k, v]) => { attrs[k] = v; });
          }
          setSelectedAttributes(attrs);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const attributeKeys = useCallback(() => {
    const keys = new Set();
    skus.forEach(sku => {
      if (sku.attributes) Object.keys(sku.attributes).forEach(k => keys.add(k));
    });
    return Array.from(keys);
  }, [skus]);

  const attributeValues = useCallback((key) => {
    const vals = new Set();
    skus.forEach(sku => {
      if (sku.attributes && sku.attributes[key] != null) vals.add(String(sku.attributes[key]));
    });
    return Array.from(vals);
  }, [skus]);

  const handleAttributeSelect = useCallback((key, value) => {
    const newAttrs = { ...selectedAttributes, [key]: value };
    setSelectedAttributes(newAttrs);
    const matched = skus.find(sku => {
      if (!sku.attributes) return false;
      return Object.entries(newAttrs).every(([k, v]) => String(sku.attributes[k]) === String(v));
    });
    setSelectedSku(matched || null);
  }, [selectedAttributes, skus]);

  const handleAddToCart = useCallback(async () => {
    if (!selectedSku) return;
    setAddingToCart(true);
    setCartError(null);
    setCartSuccess(false);
    try {
      const cartId = await getOrCreateCart();
      await addToCart(cartId, selectedSku.id, quantity);
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (err) {
      setCartError(err.message);
    } finally {
      setAddingToCart(false);
    }
  }, [selectedSku, quantity]);

  const displayPrice = useCallback(() => {
    if (selectedSku) {
      const p = selectedSku.priceInclTax ?? selectedSku.price ?? selectedSku.mrp ?? 0;
      return { price: p, taxLabel: selectedSku.taxLabel || 'Inclusive of all taxes' };
    }
    if (product) {
      const p = product.priceInclTax ?? product.minPrice ?? product.price ?? 0;
      return { price: p, taxLabel: product.taxLabel || 'Inclusive of all taxes' };
    }
    return { price: 0, taxLabel: '' };
  }, [selectedSku, product]);

  const stockInfo = selectedSku
    ? { inStock: (selectedSku.stock ?? selectedSku.stockQuantity ?? 1) > 0, count: selectedSku.stock ?? selectedSku.stockQuantity ?? 0 }
    : { inStock: true, count: null };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: tokens.colorCanvas, fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            <div style={{ aspectRatio: '1/1', background: '#e9ecef', borderRadius: tokens.radiusMd }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[240, 120, 80, 160, 200].map((w, i) => (
                <div key={i} style={{ height: '20px', width: `${w}px`, background: '#e9ecef', borderRadius: tokens.radiusXs }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: '100vh', background: tokens.colorCanvas, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: tokens.colorInk, marginBottom: '8px' }}>{error || 'Product not found'}</div>
          <Link to="/products" style={{ color: tokens.colorPrimary, fontSize: '14px' }}>Browse all products</Link>
        </div>
      </div>
    );
  }

  const { price: displayedPrice, taxLabel } = displayPrice();
  const formattedPrice = typeof displayedPrice === 'number' ? `\u20B9${displayedPrice.toLocaleString('en-IN')}` : displayedPrice;
  const mrp = selectedSku?.mrp ?? product.mrp;
  const formattedMrp = mrp && mrp > displayedPrice ? `\u20B9${mrp.toLocaleString('en-IN')}` : null;
  const discountPct = formattedMrp && mrp > 0 ? Math.round((1 - displayedPrice / mrp) * 100) : null;
  const attrKeys = attributeKeys();

  return (
    <div style={{ minHeight: '100vh', background: tokens.colorCanvas, fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '24px', fontSize: '13px', color: tokens.colorMuted }}>
          <Link to="/" style={{ color: tokens.colorPrimary, textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>{'/'}</span>
          <Link to="/products" style={{ color: tokens.colorPrimary, textDecoration: 'none' }}>Products</Link>
          {product.categoryName && (
            <>
              <span style={{ margin: '0 8px' }}>{'/'}</span>
              <Link to={`/categories/${product.categorySlug || product.categoryId}/products`} style={{ color: tokens.colorPrimary, textDecoration: 'none' }}>{product.categoryName}</Link>
            </>
          )}
          <span style={{ margin: '0 8px' }}>{'/'}</span>
          <span style={{ color: tokens.colorBody }}>{product.name}</span>
        </nav>

        {/* Main Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '48px', marginBottom: '48px' }}>
          {/* Left: Gallery */}
          <div>
            <ImageGallery images={images} productName={product.name} />
          </div>

          {/* Right: Product Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {product.brandName && (
              <div style={{ fontSize: '12px', color: tokens.colorMuted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '8px' }}>{product.brandName}</div>
            )}

            <h1 style={{ fontSize: '24px', fontWeight: 700, color: tokens.colorInk, letterSpacing: '-0.01em', lineHeight: '32px', marginBottom: '12px' }}>{product.name}</h1>

            {product.shortDescription && (
              <p style={{ fontSize: '14px', color: tokens.colorMuted, lineHeight: '1.6', marginBottom: '16px' }}>{product.shortDescription}</p>
            )}

            {/* Price Block */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: tokens.colorInk, letterSpacing: '-0.02em' }}>{formattedPrice}</span>
                {formattedMrp && (
                  <span style={{ fontSize: '18px', color: tokens.colorMuted, textDecoration: 'line-through' }}>{formattedMrp}</span>
                )}
                {discountPct && discountPct > 0 && (
                  <span style={{ fontSize: '14px', fontWeight: 600, color: tokens.colorSuccess, background: tokens.colorSuccessSubtle, padding: '2px 8px', borderRadius: tokens.radiusXs }}>
                    {discountPct}% off
                  </span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: tokens.colorMuted, marginTop: '4px' }}>{taxLabel}</div>
            </div>

            {/* Stock Status */}
            <div style={{ marginBottom: '20px' }}>
              {stockInfo.inStock ? (
                <span style={{ fontSize: '13px', fontWeight: 600, color: tokens.colorSuccess, background: tokens.colorSuccessSubtle, padding: '4px 10px', borderRadius: tokens.radiusXs }}>
                  In Stock{stockInfo.count != null && stockInfo.count <= 10 ? ` — Only ${stockInfo.count} left` : ''}
                </span>
              ) : (
                <span style={{ fontSize: '13px', fontWeight: 600, color: tokens.colorError, background: tokens.colorErrorSubtle, padding: '4px 10px', borderRadius: tokens.radiusXs }}>Out of Stock</span>
              )}
            </div>

            {/* Variant Picker */}
            {attrKeys.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                {attrKeys.map(key => (
                  <VariantAttribute
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    values={attributeValues(key)}
                    selected={selectedAttributes[key] || ''}
                    onSelect={val => handleAttributeSelect(key, val)}
                  />
                ))}
              </div>
            )}

            {/* SKU Code */}
            {selectedSku?.sku && (
              <div style={{ fontSize: '12px', color: tokens.colorMuted, marginBottom: '16px' }}>
                SKU: <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", fontSize: '12px' }}>{selectedSku.sku}</span>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                maxStock={stockInfo.count}
              />
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || !selectedSku || !stockInfo.inStock}
                style={{
                  flex: 1,
                  minWidth: '160px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: (!selectedSku || !stockInfo.inStock) ? tokens.colorDisabledBg : tokens.colorPrimary,
                  color: (!selectedSku || !stockInfo.inStock) ? tokens.colorDisabledText : '#fff',
                  border: 'none',
                  borderRadius: tokens.radiusMd,
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: (!selectedSku || !stockInfo.inStock) ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (selectedSku && stockInfo.inStock) e.currentTarget.style.background = tokens.colorPrimaryDark; }}
                onMouseLeave={e => { if (selectedSku && stockInfo.inStock) e.currentTarget.style.background = tokens.colorPrimary; }}
              >
                <img src={cartIcon} alt="" width={20} height={20} style={{ filter: (!selectedSku || !stockInfo.inStock) ? 'none' : 'brightness(0) invert(1)' }} />
                {addingToCart ? 'Adding...' : !selectedSku ? 'Select Variant' : !stockInfo.inStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            {/* Cart Feedback */}
            {cartSuccess && (
              <div style={{ padding: '12px 16px', background: tokens.colorSuccessSubtle, borderRadius: tokens.radiusSm, color: tokens.colorSuccess, fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>
                Added to cart successfully!
              </div>
            )}
            {cartError && (
              <div style={{ padding: '12px 16px', background: tokens.colorErrorSubtle, borderRadius: tokens.radiusSm, color: tokens.colorError, fontSize: '14px', marginBottom: '12px' }}>
                {cartError}
              </div>
            )}

            {/* Quick Info */}
            {product.highlights && product.highlights.length > 0 && (
              <div style={{ background: tokens.colorPrimarySubtle, borderRadius: tokens.radiusSm, padding: '12px 16px', marginTop: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: tokens.colorPrimary, marginBottom: '8px' }}>Highlights</div>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {product.highlights.map((h, i) => (
                    <li key={i} style={{ fontSize: '13px', color: tokens.colorBody }}>{h}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div style={{ background: tokens.colorSurface, borderRadius: tokens.radiusMd, border: '1px solid #e9ecef', overflow: 'hidden' }}>
          {/* Tab Nav */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e9ecef', overflow: 'auto' }}>
            {['description', 'specifications', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '14px 24px',
                  fontSize: '14px',
                  fontWeight: activeTab === tab ? 600 : 400,
                  color: activeTab === tab ? tokens.colorPrimary : tokens.colorMuted,
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab ? `2px solid ${tokens.colorPrimary}` : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  textTransform: 'capitalize',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '24px' }}>
            {activeTab === 'description' && (
              <div style={{ fontSize: '15px', color: tokens.colorBody, lineHeight: '1.625', maxWidth: '72ch' }}>
                {product.description ? (
                  <p style={{ margin: 0 }}>{product.description}</p>
                ) : (
                  <p style={{ margin: 0, color: tokens.colorMuted }}>No description available.</p>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <tbody>
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <tr key={key} style={{ borderBottom: '1px solid #e9ecef' }}>
                          <td style={{ padding: '10px 0', fontWeight: 600, color: tokens.colorInk, width: '40%', paddingRight: '16px' }}>{key}</td>
                          <td style={{ padding: '10px 0', color: tokens.colorBody }}>{String(val)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: tokens.colorMuted, fontSize: '14px' }}>No specifications available.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div style={{ color: tokens.colorMuted, fontSize: '14px' }}>
                <p>Customer reviews are not yet available for this product.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
