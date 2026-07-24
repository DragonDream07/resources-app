import React from 'react';
import { Link } from 'react-router-dom';
import starIcon from '@/assets/icons/star.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import PriceDisplay from './PriceDisplay';

const ProductCard = ({ product }) => {
  if (!product) return null;

  const {
    productId,
    name,
    price,
    originalPrice,
    rating,
    reviewCount,
    images,
    slug,
  } = product;

  const imageUrl = images && images.length > 0 ? images[0] : placeholderProduct;
  const linkTo = slug ? `/products/${slug}` : `/products/${productId}`;

  return (
    <Link
      to={linkTo}
      className="product-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div
        className="product-card__image-wrapper"
        style={{
          position: 'relative',
          paddingTop: '100%',
          backgroundColor: '#f3f4f6',
          overflow: 'hidden',
        }}
      >
        <img
          src={imageUrl}
          alt={name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            e.currentTarget.src = placeholderProduct;
          }}
        />
        {rating != null && (
          <span
            className="product-card__rating-badge"
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '999px',
            }}
          >
            <img src={starIcon} alt="rating" style={{ width: '12px', height: '12px', filter: 'brightness(0) invert(1)' }} />
            {Number(rating).toFixed(1)}
            {reviewCount != null && (
              <span style={{ fontWeight: 400, opacity: 0.85 }}>({reviewCount})</span>
            )}
          </span>
        )}
      </div>
      <div
        className="product-card__body"
        style={{
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flexGrow: 1,
        }}
      >
        <p
          className="product-card__name"
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '1.4',
            color: '#111827',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {name}
        </p>
        <PriceDisplay price={price} originalPrice={originalPrice} />
      </div>
    </Link>
  );
};

export default ProductCard;
