import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, clearToasts } = context;

  const toast = (message, options = {}) => {
    addToast({ message, type: 'info', ...options });
  };

  const success = (message, options = {}) => {
    addToast({ message, type: 'success', ...options });
  };

  const error = (message, options = {}) => {
    addToast({ message, type: 'error', ...options });
  };

  const warning = (message, options = {}) => {
    addToast({ message, type: 'warning', ...options });
  };

  return {
    toast,
    success,
    error,
    warning,
    removeToast,
    clearToasts,
  };
}
