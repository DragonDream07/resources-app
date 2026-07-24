import React, { createContext, useCallback, useContext, useState } from 'react';
import Toast from './Toast';

const ToastContext = createContext(null);

let _nextId = 1;

export const ToastProvider = ({ children, position = 'bottom-right' }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', message, duration = 5000 }) => {
    const id = _nextId++;
    setToasts((prev) => [...prev, { id, type, message, duration }]);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const positionClasses = {
    'top-right': 'top-4 right-4 items-end',
    'top-left': 'top-4 left-4 items-start',
    'bottom-right': 'bottom-4 right-4 items-end',
    'bottom-left': 'bottom-4 left-4 items-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  }[position] || 'bottom-4 right-4 items-end';

  return (
    <ToastContext.Provider value={{ addToast, dismissToast }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className={`fixed z-[9999] flex flex-col gap-2 ${positionClasses}`}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onDismiss={dismissToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};

const ToastContainer = ({ position }) => {
  return <ToastProvider position={position}>{null}</ToastProvider>;
};

export default ToastContainer;
