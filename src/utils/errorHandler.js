import { ERROR_MESSAGES } from './errorMessages';

// Global error handler utility
export class ErrorHandler {
  // Handle API errors from backend
  static handleApiError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return this.handleBadRequest(data);
        case 401:
          return ERROR_MESSAGES.AUTH.LOGIN_REQUIRED;
        case 403:
          return ERROR_MESSAGES.AUTH.UNAUTHORIZED;
        case 404:
          return ERROR_MESSAGES.GENERAL.RESOURCE_NOT_FOUND;
        case 409:
          return this.handleConflictError(data);
        case 422:
          return this.handleValidationError(data);
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
          return ERROR_MESSAGES.API.SERVER_ERROR;
        default:
          return data?.error?.message || ERROR_MESSAGES.API.UNKNOWN_ERROR;
      }
    } else if (error.request) {
      // Request made but no response received
      return ERROR_MESSAGES.API.NETWORK_ERROR;
    } else {
      // Something else happened
      return error.message || ERROR_MESSAGES.API.UNKNOWN_ERROR;
    }
  }

  // Handle validation errors
  static handleValidationError(data) {
    if (data?.error?.message) {
      return data.error.message;
    }
    
    if (data?.errors && Array.isArray(data.errors)) {
      return data.errors.map(err => err.msg).join(', ');
    }
    
    return ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD;
  }

  // Handle bad request errors
  static handleBadRequest(data) {
    if (data?.error?.message) {
      return data.error.message;
    }
    
    return ERROR_MESSAGES.API.UNKNOWN_ERROR;
  }

  // Handle conflict errors (duplicate data)
  static handleConflictError(data) {
    if (data?.error?.message) {
      return data.error.message;
    }
    
    return ERROR_MESSAGES.GENERAL.OPERATION_FAILED;
  }

  // Handle form validation errors
  static handleFormError(field, type, additionalData = {}) {
    switch (type) {
      case 'required':
        return ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD;
      case 'minLength':
        return ERROR_MESSAGES.VALIDATION.MIN_LENGTH(field, additionalData.length);
      case 'maxLength':
        return ERROR_MESSAGES.VALIDATION.MAX_LENGTH(field, additionalData.length);
      case 'email':
        return ERROR_MESSAGES.AUTH.INVALID_EMAIL;
      case 'password':
        return ERROR_MESSAGES.AUTH.WEAK_PASSWORD;
      case 'passwordMismatch':
        return ERROR_MESSAGES.VALIDATION.PASSWORD_MISMATCH;
      default:
        return ERROR_MESSAGES.VALIDATION.INVALID_FORMAT(field);
    }
  }

  // Handle network errors
  static handleNetworkError(error) {
    if (error.code === 'ECONNABORTED') {
      return ERROR_MESSAGES.API.TIMEOUT;
    }
    
    if (error.message.includes('Network Error')) {
      return ERROR_MESSAGES.API.NETWORK_ERROR;
    }
    
    return ERROR_MESSAGES.API.UNKNOWN_ERROR;
  }

  // Get user-friendly error message
  static getErrorMessage(error, fallback = ERROR_MESSAGES.GENERAL.SOMETHING_WENT_WRONG) {
    try {
      if (typeof error === 'string') {
        return error;
      }
      
      if (error?.message) {
        return error.message;
      }
      
      if (error?.error?.message) {
        return error.error.message;
      }
      
      return fallback;
    } catch {
      return fallback;
    }
  }

  // Log error for debugging
  static logError(error, context = '') {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${context}] Error:`, error);
    }
  }
}

// Export default instance
export default ErrorHandler;
