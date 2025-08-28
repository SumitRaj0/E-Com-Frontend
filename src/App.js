import React from 'react';
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
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import MerchantDashboard from './pages/MerchantDashboard/MerchantDashboard';
import Checkout from './pages/Checkout/Checkout';
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

const AppContent = () => {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <Header />
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
