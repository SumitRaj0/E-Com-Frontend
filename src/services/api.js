import axios from 'axios';
import ErrorHandler from '../utils/errorHandler';
import API_CONFIG from '../config/api';

// Get API base URL with fallback logic
const API_BASE_URL = API_CONFIG.getBaseUrl();

// Log which API URL is being used
console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', process.env.NODE_ENV);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors globally
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API service
export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      const errorMessage = ErrorHandler.handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      const errorMessage = ErrorHandler.handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      const errorMessage = ErrorHandler.handleApiError(error);
      throw new Error(errorMessage);
    }
  },
};

// Category API service
export const categoryAPI = {
  // Get all categories
  getAll: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      const errorMessage = ErrorHandler.handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Get category by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = ErrorHandler.handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Create new category
  create: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      const errorMessage = ErrorHandler.handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Update category
  update: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      const errorMessage = ErrorHandler.handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Delete category
  delete: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = ErrorHandler.handleApiError(error);
      throw new Error(errorMessage);
    }
  },
};

// Product API service
export const productAPI = {
  // Get all products with filters
  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/products', { params: filters });
      return response.data;
    } catch (error) {
      const errorMessage = ErrorHandler.handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Get product by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = ErrorHandler.handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Create new product
  create: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      const errorMessage = ErrorHandler.handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Update product
  update: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      const errorMessage = ErrorHandler.handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Delete product
  delete: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = ErrorHandler.handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Get merchant products
  getMerchantProducts: async (filters = {}) => {
    try {
      const response = await api.get('/products/merchant/my-products', {
        params: filters,
      });
      return response.data;
    } catch (error) {
      const errorMessage = ErrorHandler.handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Get product statistics
  getStats: async () => {
    try {
      const response = await api.get('/products/merchant/stats');
      return response.data;
    } catch (error) {
      const errorMessage = ErrorHandler.handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Get filter options
  getFilterOptions: async () => {
    try {
      const response = await api.get('/products/filter-options');
      return response.data;
    } catch (error) {
      const errorMessage = ErrorHandler.handleApiError(error);
      throw new Error(errorMessage);
    }
  },
};
// Health check function to test API connectivity
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { success: false, error: error.message };
  }
};

export default api;
