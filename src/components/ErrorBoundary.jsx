import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='card h-100'>
          <div className='card-body text-center p-4'>
            <div className='text-danger mb-2'>
              <i className='bi bi-exclamation-triangle-fill fs-1'></i>
            </div>
            <h6 className='text-danger'>Something went wrong</h6>
            <p className='text-muted small mb-3'>
              Failed to load component. Please refresh the page.
            </p>
            <button
              className='btn btn-outline-primary btn-sm'
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
