// Centralized error messages for the application
export const ERROR_MESSAGES = {
  // Authentication errors
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    EMAIL_EXISTS: 'Email already exists',
    WEAK_PASSWORD: 'Password must be at least 6 characters',
    INVALID_EMAIL: 'Please enter a valid email address',
    TOKEN_EXPIRED: 'Session expired. Please login again',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    LOGIN_REQUIRED: 'Please login to continue',
  },

  // Form validation errors
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    MIN_LENGTH: (field, length) =>
      `${field} must be at least ${length} characters`,
    MAX_LENGTH: (field, length) =>
      `${field} must not exceed ${length} characters`,
    INVALID_FORMAT: (field) => `Invalid ${field} format`,
    PASSWORD_MISMATCH: 'Passwords do not match',
  },

  // API errors
  API: {
    NETWORK_ERROR: 'Network error. Please check your connection',
    SERVER_ERROR: 'Server error. Please try again later',
    TIMEOUT: 'Request timeout. Please try again',
    UNKNOWN_ERROR: 'An unexpected error occurred',
    FETCH_FAILED: 'Failed to fetch data',
    UPDATE_FAILED: 'Failed to update data',
    DELETE_FAILED: 'Failed to delete data',
    CREATE_FAILED: 'Failed to create data',
  },

  // Product errors
  PRODUCT: {
    NOT_FOUND: 'Product not found',
    INVALID_PRICE: 'Please enter a valid price',
    INVALID_CATEGORY: 'Please select a valid category',
    INVALID_SUBCATEGORY: 'Please select a valid subcategory',
  },

  // Category errors
  CATEGORY: {
    NOT_FOUND: 'Category not found',
    NAME_EXISTS: 'Category name already exists',
    INVALID_NAME: 'Category name must be at least 2 characters',
  },

  // General errors
  GENERAL: {
    SOMETHING_WENT_WRONG: 'Something went wrong. Please try again',
    PERMISSION_DENIED: 'Permission denied',
    RESOURCE_NOT_FOUND: 'Resource not found',
    OPERATION_FAILED: 'Operation failed. Please try again',
  },
};

// Success messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Login successful',
    REGISTER_SUCCESS: 'Registration successful',
    LOGOUT_SUCCESS: 'Logout successful',
    PASSWORD_CHANGED: 'Password changed successfully',
  },

  PRODUCT: {
    CREATED: 'Product created successfully',
    UPDATED: 'Product updated successfully',
    DELETED: 'Product deleted successfully',
  },

  CATEGORY: {
    CREATED: 'Category created successfully',
    UPDATED: 'Category updated successfully',
    DELETED: 'Category deleted successfully',
  },

  GENERAL: {
    SAVED: 'Data saved successfully',
    UPDATED: 'Data updated successfully',
    DELETED: 'Data deleted successfully',
  },
};

// Info messages
export const INFO_MESSAGES = {
  AUTH: {
    LOGGING_IN: 'Logging in...',
    REGISTERING: 'Creating account...',
    LOGGING_OUT: 'Logging out...',
  },

  PRODUCT: {
    LOADING: 'Loading products...',
    SAVING: 'Saving product...',
  },

  GENERAL: {
    LOADING: 'Loading...',
    SAVING: 'Saving...',
    PROCESSING: 'Processing...',
  },
};
