import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  className = '',
}) => {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  const trapFocus = useCallback((e) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTORS));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    if (e.key === 'Escape') {
      onClose && onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        const dialog = dialogRef.current;
        if (dialog) {
          const focusable = dialog.querySelectorAll(FOCUSABLE_SELECTORS);
          if (focusable.length > 0) {
            focusable[0].focus();
          } else {
            dialog.focus();
          }
        }
      });
    } else {
      document.body.style.overflow = '';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', trapFocus);
    }
    return () => {
      document.removeEventListener('keydown', trapFocus);
    };
  }, [open, trapFocus]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose && onClose();
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      {/* Dialog panel */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={[
          'relative z-10 w-full rounded-xl bg-white outline-none',
          'shadow-[0_20px_60px_-10px_rgba(0,0,0,0.35),0_8px_20px_-5px_rgba(0,0,0,0.15)]',
          sizeClasses[size] || sizeClasses.md,
          className,
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          {title && (
            <h2 id="modal-title" className="text-base font-semibold text-gray-900">
              {title}
            </h2>
          )}
          <button
            type="button"
            aria-label="Close dialog"
            onClick={() => onClose && onClose()}
            className="ml-auto rounded-md p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-4">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
