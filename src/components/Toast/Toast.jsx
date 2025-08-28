import React from 'react';
import { getToastStyles } from '../../hooks/useToast';

// Toast component for displaying notifications
const Toast = ({ toast, onRemove }) => {
  const handleRemove = () => {
    onRemove(toast.id);
  };

  const styles = getToastStyles(toast.type);

  return (
    <div style={styles} className="toast-item">
      <div className="toast-content">
        <span className="toast-message">{toast.message}</span>
      </div>
      
      <button
        onClick={handleRemove}
        className="toast-close"
        style={{
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          color: 'inherit',
          padding: '0',
          marginLeft: '12px',
        }}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

// Toast container component
export const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="toast-container"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default Toast;
