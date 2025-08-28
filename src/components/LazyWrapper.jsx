import React, { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';

// Reusable lazy loading wrapper with consistent loading state
export const LazyWrapper = ({ children, fallback, minHeight = '200px' }) => {
  const defaultFallback = (
    <div className='card h-100'>
      <div
        className='card-body d-flex align-items-center justify-content-center'
        style={{ minHeight }}
      >
        <div
          className='spinner-border spinner-border-sm text-primary'
          role='status'
        >
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default LazyWrapper;
