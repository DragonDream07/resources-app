import React from 'react';
import ProductCard from './ProductCard';

const SkeletonCard = () => (
  <div
    className="skeleton-card"
    style={{
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
      backgroundColor: '#ffffff',
    }}
  >
    <div
      style={{
        paddingTop: '100%',
        backgroundColor: '#e5e7eb',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    />
    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div
        style={{
          height: '14px',
          borderRadius: '4px',
          backgroundColor: '#e5e7eb',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      <div
        style={{
          height: '14px',
          borderRadius: '4px',
          backgroundColor: '#e5e7eb',
          width: '60%',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      <div
        style={{
          height: '16px',
          borderRadius: '4px',
          backgroundColor: '#e5e7eb',
          width: '40%',
          marginTop: '4px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
    </div>
  </div>
);

const ProductGrid = ({ products = [], loading = false, skeletonCount = 12 }) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    width: '100%',
  };

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
        <div className="product-grid product-grid--loading" style={gridStyle}>
          {Array.from({ length: skeletonCount }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      </>
    );
  }

  if (!products.length) {
    return (
      <div
        className="product-grid product-grid--empty"
        style={{
          textAlign: 'center',
          padding: '48px 16px',
          color: '#6b7280',
          fontSize: '16px',
        }}
      >
        No products found.
      </div>
    );
  }

  return (
    <div className="product-grid" style={gridStyle}>
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
