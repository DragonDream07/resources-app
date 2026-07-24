import { Link } from 'react-router-dom';
import logoSrc from '@/assets/images/logo.svg';
import emptyStateSrc from '@/assets/images/empty-state.svg';
import chevronLeftSrc from '@/assets/icons/chevron-left.svg';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-canvas, #f8f9fa)',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          background: 'var(--color-surface, #ffffff)',
          borderBottom: '1px solid var(--color-border, #868e96)',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
          }}
        >
          <img src={logoSrc} alt="ShopMini logo" height={32} width={32} />
          <span
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--color-primary, #4c6ef5)',
              letterSpacing: '-0.01em',
            }}
          >
            ShopMini
          </span>
        </Link>
      </header>

      <main
        id="main-content"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 24px',
          textAlign: 'center',
          gap: '24px',
        }}
      >
        <img
          src={emptyStateSrc}
          alt="Page not found illustration"
          style={{ width: '100%', maxWidth: '280px', height: 'auto' }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--color-muted, #495057)',
              margin: 0,
            }}
          >
            Error 404
          </p>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: '40px',
              color: 'var(--color-ink, #212529)',
              margin: 0,
            }}
          >
            Page Not Found
          </h1>
          <p
            style={{
              fontSize: '16px',
              lineHeight: '24px',
              color: 'var(--color-muted, #495057)',
              margin: 0,
              maxWidth: '420px',
            }}
          >
            Sorry, the page you are looking for does not exist, has been moved, or is temporarily unavailable.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '44px',
              padding: '0 24px',
              background: 'var(--color-primary, #4c6ef5)',
              color: '#ffffff',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            <img src={chevronLeftSrc} alt="" aria-hidden="true" width={16} height={16} style={{ filter: 'brightness(0) invert(1)' }} />
            Go to Home
          </Link>
          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '44px',
              padding: '0 24px',
              background: 'var(--color-surface, #ffffff)',
              color: 'var(--color-primary, #4c6ef5)',
              border: '1px solid var(--color-primary, #4c6ef5)',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Browse Products
          </Link>
        </div>
      </main>

      <footer
        style={{
          background: 'var(--color-surface, #ffffff)',
          borderTop: '1px solid var(--color-border, #868e96)',
          padding: '20px 24px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--color-muted, #495057)',
        }}
      >
        © ShopMini. All rights reserved.
      </footer>
    </div>
  );
}
