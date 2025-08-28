// API Configuration
const API_CONFIG = {
  // Primary: Render production URL
  PRODUCTION: 'https://e-com-backend-y9ps.onrender.com/api',

  // Fallback: Local development URL
  LOCAL: 'http://localhost:5050/api',
  // Get the appropriate API URL based on environment
  getBaseUrl: () => {
    // Check if we're in production (Render)
    if (process.env.NODE_ENV === 'production') {
      return API_CONFIG.PRODUCTION;
    }

    // Check if custom API URL is set
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }

    return API_CONFIG.LOCAL;
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
  }),
};

export default API_CONFIG;
