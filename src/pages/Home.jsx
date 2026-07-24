import { Link } from 'react-router-dom';
import logoSrc from '@/assets/images/logo.svg';
import placeholderProductSrc from '@/assets/images/placeholder-product.svg';
import searchIconSrc from '@/assets/icons/search.svg';
import cartIconSrc from '@/assets/icons/cart.svg';
import userIconSrc from '@/assets/icons/user.svg';
import chevronRightSrc from '@/assets/icons/chevron-right.svg';
import starSrc from '@/assets/icons/star.svg';
import heartSrc from '@/assets/icons/heart.svg';

const CATEGORIES = [
  { label: 'Electronics', emoji: '📱', path: '/categories/electronics' },
  { label: 'Fashion', emoji: '👗', path: '/categories/fashion' },
  { label: 'Home & Living', emoji: '🏠', path: '/categories/home-living' },
  { label: 'Sports', emoji: '⚽', path: '/categories/sports' },
  { label: 'Books', emoji: '📚', path: '/categories/books' },
  { label: 'Beauty', emoji: '💄', path: '/categories/beauty' },
];

const FEATURED_PRODUCTS = [
  { id: '1', name: 'Wireless Headphones', price: 1999, originalPrice: 3999, rating: 4.5, reviews: 128 },
  { id: '2', name: 'Running Shoes', price: 2499, originalPrice: 4999, rating: 4.3, reviews: 84 },
  { id: '3', name: 'Smart Watch', price: 5999, originalPrice: 9999, rating: 4.7, reviews: 215 },
  { id: '4', name: 'Yoga Mat', price: 799, originalPrice: 1499, rating: 4.2, reviews: 56 },
];

function NavBar() {
  return (
    <nav
      style={{
        background: 'var(--color-surface, #ffffff)',
        borderBottom: '1px solid var(--color-border, #868e96)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <img src={logoSrc} alt="ShopMini logo" height={32} width={32} />
          <span
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--color-primary, #4c6ef5)',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              letterSpacing: '-0.01em',
            }}
          >
            ShopMini
          </span>
        </Link>

        <div style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
          <img
            src={searchIconSrc}
            alt=""
            aria-hidden="true"
            width={16}
            height={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: 0.5,
            }}
          />
          <input
            type="search"
            placeholder="Search products…"
            aria-label="Search products"
            style={{
              width: '100%',
              height: '44px',
              paddingLeft: '40px',
              paddingRight: '12px',
              border: '1px solid var(--color-border, #868e96)',
              borderRadius: '6px',
              fontSize: '16px',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              color: 'var(--color-ink, #212529)',
              background: 'var(--color-canvas, #f8f9fa)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            to="/cart"
            aria-label="Cart"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: 'var(--color-ink, #212529)',
            }}
          >
            <img src={cartIconSrc} alt="Cart" width={22} height={22} />
          </Link>
          <Link
            to="/account"
            aria-label="Account"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: 'var(--color-ink, #212529)',
            }}
          >
            <img src={userIconSrc} alt="Account" width={22} height={22} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroBanner() {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, var(--color-primary, #4c6ef5) 0%, var(--color-primary-dark, #3b5bdb) 100%)',
        padding: '64px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p
          style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '12px',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          Limited Time Offer
        </p>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: '40px',
            color: '#ffffff',
            marginBottom: '16px',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          Up to 60% off on electronics, fashion &amp; home essentials
        </h1>
        <p
          style={{
            fontSize: '16px',
            lineHeight: '24px',
            color: 'rgba(255,255,255,0.85)',
            marginBottom: '32px',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          Shop the biggest sale of the season. New deals added every day.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '44px',
              padding: '0 24px',
              background: '#ffffff',
              color: 'var(--color-primary, #4c6ef5)',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '9999px',
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Shop All Deals
            <img src={chevronRightSrc} alt="" aria-hidden="true" width={16} height={16} />
          </Link>
          <Link
            to="/categories/home-living"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '44px',
              padding: '0 24px',
              background: 'transparent',
              color: '#ffffff',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '9999px',
              textDecoration: 'none',
              border: '2px solid rgba(255,255,255,0.7)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            🏠 Home &amp; Living
          </Link>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px',
      }}
    >
      <h2
        style={{
          fontSize: '24px',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          lineHeight: '32px',
          color: 'var(--color-ink, #212529)',
          marginBottom: '24px',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        Shop by Category
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '16px',
        }}
      >
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.label}
            to={cat.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '24px 16px',
              background: 'var(--color-surface, #ffffff)',
              border: '1px solid var(--color-border, #868e96)',
              borderRadius: '10px',
              textDecoration: 'none',
              color: 'var(--color-ink, #212529)',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '20px',
              transition: 'box-shadow 0.15s',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '32px', lineHeight: '1' }} aria-hidden="true">
              {cat.emoji}
            </span>
            {cat.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  return (
    <article
      style={{
        background: 'var(--color-surface, #ffffff)',
        border: '1px solid var(--color-border, #868e96)',
        borderRadius: '10px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ position: 'relative' }}>
        <img
          src={placeholderProductSrc}
          alt={product.name}
          style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
        />
        <span
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            background: 'var(--color-secondary, #fd7e14)',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '2px 8px',
            borderRadius: '3px',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          -{discount}%
        </span>
        <button
          aria-label={`Add ${product.name} to wishlist`}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '44px',
            height: '44px',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src={heartSrc} alt="" aria-hidden="true" width={18} height={18} />
        </button>
      </div>
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '24px',
            color: 'var(--color-ink, #212529)',
            margin: 0,
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          {product.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <img src={starSrc} alt="Rating" width={14} height={14} />
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--color-ink, #212529)',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            {product.rating}
          </span>
          <span
            style={{
              fontSize: '12px',
              color: 'var(--color-muted, #495057)',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            ({product.reviews})
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto' }}>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--color-ink, #212529)',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span
            style={{
              fontSize: '14px',
              color: 'var(--color-muted, #495057)',
              textDecoration: 'line-through',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <Link
          to={`/products/${product.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '44px',
            background: 'var(--color-primary, #4c6ef5)',
            color: '#ffffff',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            marginTop: '4px',
          }}
        >
          View Product
        </Link>
      </div>
    </article>
  );
}

function FeaturedProductsSection() {
  return (
    <section
      style={{
        background: 'var(--color-canvas, #f8f9fa)',
        padding: '40px 0',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              lineHeight: '32px',
              color: 'var(--color-ink, #212529)',
              margin: 0,
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            Featured Products
          </h2>
          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--color-link, #4c6ef5)',
              textDecoration: 'none',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            View all
            <img src={chevronRightSrc} alt="" aria-hidden="true" width={14} height={14} />
          </Link>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px',
          }}
        >
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <section
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px',
      }}
    >
      <div
        style={{
          background: 'var(--color-secondary-subtle, #fff3e6)',
          border: '1px solid var(--color-secondary, #fd7e14)',
          borderRadius: '16px',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-secondary, #fd7e14)',
            margin: 0,
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          Exclusive Offer
        </p>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--color-ink, #212529)',
            margin: 0,
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            letterSpacing: '-0.01em',
            lineHeight: '32px',
          }}
        >
          Use code&nbsp;
          <code
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              fontSize: '20px',
              background: 'var(--color-canvas, #f8f9fa)',
              padding: '2px 10px',
              borderRadius: '6px',
              color: 'var(--color-primary, #4c6ef5)',
            }}
          >
            SAVE20
          </code>
          &nbsp;for extra 20% off
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--color-muted, #495057)',
            margin: 0,
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          Valid on orders above ₹999. Limited time only.
        </p>
        <Link
          to="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: '44px',
            padding: '0 24px',
            background: 'var(--color-secondary, #fd7e14)',
            color: '#ffffff',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 600,
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        background: 'var(--color-surface, #ffffff)',
        borderTop: '1px solid var(--color-border, #868e96)',
        padding: '40px 24px',
        marginTop: '40px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '32px',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
            }}
          >
            <img src={logoSrc} alt="ShopMini logo" height={28} width={28} />
            <span
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--color-primary, #4c6ef5)',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              ShopMini
            </span>
          </Link>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--color-muted, #495057)',
              margin: 0,
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              maxWidth: '260px',
            }}
          >
            Your one-stop shop for the best deals on electronics, fashion, and more.
          </p>
        </div>
        <nav aria-label="Footer navigation" style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--color-ink, #212529)',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              Shop
            </span>
            {[{ label: 'All Products', to: '/products' }, { label: 'Categories', to: '/categories' }, { label: 'Brands', to: '/brands' }].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontSize: '14px',
                  color: 'var(--color-link, #4c6ef5)',
                  textDecoration: 'none',
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--color-ink, #212529)',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              Account
            </span>
            {[{ label: 'My Orders', to: '/orders' }, { label: 'Profile', to: '/account' }, { label: 'Notifications', to: '/notifications' }].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontSize: '14px',
                  color: 'var(--color-link, #4c6ef5)',
                  textDecoration: 'none',
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <div
        style={{
          maxWidth: '1200px',
          margin: '32px auto 0',
          paddingTop: '24px',
          borderTop: '1px solid var(--color-border, #868e96)',
          fontSize: '12px',
          color: 'var(--color-muted, #495057)',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          textAlign: 'center',
        }}
      >
        © ShopMini. All rights reserved.
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-canvas, #f8f9fa)',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <NavBar />
      <main id="main-content">
        <HeroBanner />
        <CategoriesSection />
        <FeaturedProductsSection />
        <PromoBanner />
      </main>
      <Footer />
    </div>
  );
}
