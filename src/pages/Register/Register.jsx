import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { authAPI } from '../../services/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/errorMessages';
import ErrorHandler from '../../utils/errorHandler';

// Register page component
const Register = () => {
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const { showSuccess, showError, showLoading, updateLoadingToast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const password = watch('password');

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const loadingToastId = showLoading(SUCCESS_MESSAGES.AUTH.REGISTERING);

      // Prepare user data
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: role,
      };

      // Call API to register user
      const response = await authAPI.register(userData);

      if (response.success) {
        // Register user in auth context
        await registerUser(response.user, response.token);
        
        // Update loading toast to success
        updateLoadingToast(loadingToastId, SUCCESS_MESSAGES.AUTH.REGISTER_SUCCESS, 'success');
        
        // Reset form
        reset();
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
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
              <h2 className="text-center mb-4">Create Account</h2>
              
              {/* Role Toggle */}
              <div className="mb-3">
                <label className="form-label">Account Type</label>
                <div className="btn-group w-100" role="group">
                  <input
                    type="radio"
                    className="btn-check"
                    name="role"
                    id="customer"
                    checked={role === 'customer'}
                    onChange={() => setRole('customer')}
                  />
                  <label className="btn btn-outline-primary" htmlFor="customer">
                    Customer
                  </label>
                  
                  <input
                    type="radio"
                    className="btn-check"
                    name="role"
                    id="merchant"
                    checked={role === 'merchant'}
                    onChange={() => setRole('merchant')}
                  />
                  <label className="btn btn-outline-primary" htmlFor="merchant">
                    Merchant
                  </label>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Name Field */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    {...register('name', {
                      required: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD,
                      minLength: {
                        value: 2,
                        message: ERROR_MESSAGES.VALIDATION.MIN_LENGTH('Name', 2),
                      },
                    })}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name.message}</div>
                  )}
                </div>

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
                      minLength: {
                        value: 6,
                        message: ERROR_MESSAGES.AUTH.WEAK_PASSWORD,
                      },
                    })}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password.message}</div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    {...register('confirmPassword', {
                      required: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD,
                      validate: (value) =>
                        value === password || ERROR_MESSAGES.VALIDATION.PASSWORD_MISMATCH,
                    })}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword.message}</div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Login here
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

export default Register;
