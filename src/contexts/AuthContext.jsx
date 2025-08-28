import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/errorMessages';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  // Check if user is merchant
  const isMerchant = user?.role === 'merchant';

  // Check if user is customer
  const isCustomer = user?.role === 'customer';

  // Logout function - defined before useEffect to avoid temporal dead zone
  const logout = () => {
    try {
      // Clear state
      setToken(null);
      setUser(null);

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      showSuccess(SUCCESS_MESSAGES.AUTH.LOGOUT_SUCCESS);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (userData, authToken) => {
    try {
      // Store token and user data
      setToken(authToken);
      setUser(userData);

      // Save to localStorage
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      showSuccess(SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS);
      return true;
    } catch (error) {
      showError(ERROR_MESSAGES.AUTH.LOGIN_REQUIRED);
      return false;
    }
  };

  // Register function
  const register = async (userData, authToken) => {
    try {
      // Store token and user data
      setToken(authToken);
      setUser(userData);

      // Save to localStorage
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      showSuccess(SUCCESS_MESSAGES.AUTH.REGISTER_SUCCESS);
      return true;
    } catch (error) {
      showError(ERROR_MESSAGES.GENERAL.SOMETHING_WENT_WRONG);
      return false;
    }
  };

  // Update user data
  const updateUser = (updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      setUser(newUserData);
      localStorage.setItem('user', JSON.stringify(newUserData));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Check token validity
  const checkTokenValidity = () => {
    if (!token) return false;

    try {
      // Decode JWT token (basic check)
      let payload;
      if (typeof window !== 'undefined' && window.atob) {
        payload = JSON.parse(window.atob(token.split('.')[1]));
      } else if (typeof Buffer !== 'undefined') {
        payload = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString()
        );
      } else {
        // Fallback for environments without atob or Buffer
        const base64 = token.split('.')[1];
        const decoded = decodeURIComponent(
          escape(atob ? atob(base64) : base64)
        );
        payload = JSON.parse(decoded);
      }

      const currentTime = Date.now() / 1000;

      if (payload.exp < currentTime) {
        logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking token validity:', error);
      logout();
      return false;
    }
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isMerchant,
    isCustomer,
    login,
    register,
    logout,
    updateUser,
    checkTokenValidity,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
