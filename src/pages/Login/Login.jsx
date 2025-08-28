import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../hooks/useToast';
import { authAPI } from '../../services/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/errorMessages';
import ErrorHandler from '../../utils/errorHandler';

// Login page component
const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { cart } = useCart();
  const { showSuccess, showError, showLoading, updateLoadingToast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const loadingToastId = showLoading(SUCCESS_MESSAGES.AUTH.LOGGING_IN);

      // Call API to login user
      const response = await authAPI.login({
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        // Login user in auth context
        await login(response.user, response.token);
        
        // Update loading toast to success
        updateLoadingToast(loadingToastId, SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS, 'success');
        
        // Reset form
        reset();
        
        // Redirect based on cart status
        setTimeout(() => {
          if (cart.length > 0) {
            // If there are items in cart, go to checkout
            navigate('/checkout');
          } else {
            // Otherwise go to dashboard
            navigate('/dashboard');
          }
        }, 1500);
      }
    } catch (error) {
      const errorMessage = ErrorHandler.getErrorMessage(error);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Login</h2>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email Field */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    {...register('email', {
                      required: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: ERROR_MESSAGES.AUTH.INVALID_EMAIL,
                      },
                    })}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email.message}</div>
                  )}
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    {...register('password', {
                      required: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD,
                    })}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password.message}</div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Logging In...' : 'Login'}
                </button>

                {/* Register Link */}
                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-decoration-none">
                      Register here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
