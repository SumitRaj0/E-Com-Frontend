/* eslint-disable no-unused-vars */
import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { ToastContainer } from './components/Toast/Toast';
import { useToast } from './hooks/useToast';

import {
  Login,
  Register,
  Dashboard,
  Products,
  MerchantDashboard,
  Checkout,
} from './utils/lazyComponents';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to='/login' />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to='/dashboard' />;
};

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
      <div className='container'>
        <Link className='navbar-brand' to='/'>
          E-Commerce
        </Link>

        <div className='navbar-nav ms-auto'>
          {isAuthenticated ? (
            <>
              <Link className='nav-link' to='/products'>
                Products
              </Link>
              {user?.role === 'merchant' && (
                <Link className='nav-link' to='/merchant-dashboard'>
                  Merchant Dashboard
                </Link>
              )}
              <Link className='nav-link position-relative' to='/checkout'>
                Cart
                {cartCount > 0 && (
                  <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link className='nav-link' to='/dashboard'>
                Dashboard
              </Link>
              <button className='btn btn-outline-light btn-sm' onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className='nav-link' to='/login'>
                Login
              </Link>
              <Link className='nav-link' to='/register'>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// Loading component for lazy loading
// eslint-disable-next-line no-unused-vars
const LoadingSpinner = () => (
  <div
    className='d-flex justify-content-center align-items-center'
    style={{ minHeight: '400px' }}
  >
    <div className='spinner-border text-primary' role='status'>
      <span className='visually-hidden'>Loading...</span>
    </div>
  </div>
);

// eslint-disable-next-line no-unused-vars
const AppContent = () => {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path='/' element={<Navigate to='/products' />} />
          <Route path='/products' element={<Products />} />
          <Route
            path='/login'
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path='/register'
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/merchant-dashboard'
            element={
              <ProtectedRoute>
                <MerchantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/checkout'
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
