// API Configuration
const API_CONFIG = {
  // Default: Render production URL (always running)
  DEFAULT: 'https://e-com-backend-y9ps.onrender.com/api',

  // Optional: Local development URL (only if needed)
  LOCAL: 'http://localhost:5050/api',

  // Get the appropriate API URL based on environment
  getBaseUrl: () => {
    // Check if custom API URL is set in environment
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }

    // Check if we're in production (Render)
    if (process.env.NODE_ENV === 'production') {
      return API_CONFIG.DEFAULT;
    }

    return API_CONFIG.DEFAULT;
  },

  // Test API connectivity
  testConnection: async () => {
    try {
      const response = await fetch(`${API_CONFIG.getBaseUrl()}/health`);
      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  },

  // Get current environment info
  getEnvironmentInfo: () => ({
    currentUrl: API_CONFIG.getBaseUrl(),
    isProduction: process.env.NODE_ENV === 'production',
    hasCustomUrl: !!process.env.REACT_APP_API_URL,
    environment: process.env.NODE_ENV || 'development',
    defaultUrl: API_CONFIG.DEFAULT,
  }),
};

export default API_CONFIG;
