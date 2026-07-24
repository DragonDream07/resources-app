import React, { useState } from 'react';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';

const ProductImageGallery = ({ images = [], productName = 'Product' }) => {
  const validImages = images.length > 0 ? images : [placeholderProduct];
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (index) => {
    setActiveIndex(Math.max(0, Math.min(index, validImages.length - 1)));
  };

  const handlePrev = () => goTo(activeIndex - 1);
  const handleNext = () => goTo(activeIndex + 1);

  return (
    <div
      className="product-image-gallery"
      style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
    >
      {/* Main image */}
      <div
        className="product-image-gallery__main"
        style={{
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#f3f4f6',
          aspectRatio: '1 / 1',
        }}
      >
        <img
          src={validImages[activeIndex]}
          alt={`${productName} — image ${activeIndex + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          onError={(e) => {
            e.currentTarget.src = placeholderProduct;
          }}
        />
        {validImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              aria-label="Previous image"
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid #e5e7eb',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === 0 ? 0.4 : 1,
              }}
            >
              <img src={chevronLeft} alt="" style={{ width: '18px', height: '18px' }} />
            </button>
            <button
              onClick={handleNext}
              disabled={activeIndex === validImages.length - 1}
              aria-label="Next image"
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid #e5e7eb',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: activeIndex === validImages.length - 1 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === validImages.length - 1 ? 0.4 : 1,
              }}
            >
              <img src={chevronRight} alt="" style={{ width: '18px', height: '18px' }} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {validImages.length > 1 && (
        <div
          className="product-image-gallery__thumbnails"
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}
        >
          {validImages.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`View image ${idx + 1}`}
              aria-pressed={idx === activeIndex}
              style={{
                flexShrink: 0,
                width: '64px',
                height: '64px',
                borderRadius: '6px',
                overflow: 'hidden',
                border: idx === activeIndex ? '2px solid #2563eb' : '2px solid #e5e7eb',
                padding: 0,
                cursor: 'pointer',
                backgroundColor: '#f3f4f6',
              }}
            >
              <img
                src={src}
                alt={`Thumbnail ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  e.currentTarget.src = placeholderProduct;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
