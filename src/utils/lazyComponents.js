import { lazy } from 'react';

// Centralized lazy loading for all components
// This approach avoids ESLint "unused variable" warnings
export const lazyComponents = {
  // Page components
  Login: lazy(() => import('../pages/Login/Login')),
  Register: lazy(() => import('../pages/Register/Register')),
  Dashboard: lazy(() => import('../pages/Dashboard/Dashboard')),
  Products: lazy(() => import('../pages/Products/Products')),
  MerchantDashboard: lazy(
    () => import('../pages/MerchantDashboard/MerchantDashboard')
  ),
  Checkout: lazy(() => import('../pages/Checkout/Checkout')),

  // Component components
  ProductCard: lazy(() => import('../components/ProductCard/ProductCard')),
};

// Destructure for easier use
export const {
  Login,
  Register,
  Dashboard,
  Products,
  MerchantDashboard,
  Checkout,
  ProductCard,
} = lazyComponents;
