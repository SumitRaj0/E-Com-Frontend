import { useState, useCallback } from 'react';

// Custom toast hook for notifications
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  // Remove a specific toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Add a new toast
  const addToast = useCallback(
    (message, type = 'info', duration = 5000) => {
      const id = Date.now() + Math.random();
      const newToast = {
        id,
        message,
        type,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove toast after duration
      if (duration > 0) {
        window.setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  // Remove all toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Success toast
  const showSuccess = useCallback(
    (message, duration) => {
      return addToast(message, 'success', duration);
    },
    [addToast]
  );

  // Error toast
  const showError = useCallback(
    (message, duration) => {
      return addToast(message, 'error', duration);
    },
    [addToast]
  );

  // Warning toast
  const showWarning = useCallback(
    (message, duration) => {
      return addToast(message, 'warning', duration);
    },
    [addToast]
  );

  // Info toast
  const showInfo = useCallback(
    (message, duration) => {
      return addToast(message, 'info', duration);
    },
    [addToast]
  );

  // Loading toast
  const showLoading = useCallback(
    (message) => {
      return addToast(message, 'loading', 0);
    },
    [addToast]
  );

  // Update loading toast to success/error
  const updateLoadingToast = useCallback(
    (id, message, type) => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id ? { ...toast, message, type } : toast
        )
      );

      // Auto remove after showing result
      window.setTimeout(() => {
        removeToast(id);
      }, 3000);
    },
    [removeToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    updateLoadingToast,
  };
};

// Toast types and their styling
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading',
};

// Toast component styles (can be customized)
export const getToastStyles = (type) => {
  const baseStyles = {
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '300px',
    maxWidth: '500px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
  };

  const typeStyles = {
    success: {
      backgroundColor: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb',
    },
    error: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb',
    },
    warning: {
      backgroundColor: '#fff3cd',
      color: '#856404',
      border: '1px solid #ffeaa7',
    },
    info: {
      backgroundColor: '#d1ecf1',
      color: '#0c5460',
      border: '1px solid #bee5eb',
    },
    loading: {
      backgroundColor: '#e2e3e5',
      color: '#383d41',
      border: '1px solid #d6d8db',
    },
  };

  return { ...baseStyles, ...typeStyles[type] };
};
