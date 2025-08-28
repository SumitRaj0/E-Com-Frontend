import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { productAPI } from '../../services/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/errorMessages';
import ErrorHandler from '../../utils/errorHandler';
import { PREDEFINED_CATEGORIES } from '../../constants/categories';

// Merchant Dashboard for managing products
const MerchantDashboard = () => {
  const { user } = useAuth();
  const { showSuccess, showError, showLoading, updateLoadingToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  // Load merchant's products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsRes = await productAPI.getMerchantProducts();
        if (productsRes?.success) {
          // Backend returns products in response.products
          const productsData = productsRes.products || [];
          // Filter out any undefined products
          const validProducts = productsData.filter(product => product);
          setProducts(validProducts);
        }
      } catch (error) {
        showError(ErrorHandler.getErrorMessage(error));
      }
    };

    loadProducts();
  }, [showError]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const loadingToastId = showLoading(SUCCESS_MESSAGES.PRODUCT.SAVING);

      const productData = {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        merchant: user._id,
      };

      let response;
      if (editingProduct) {
        response = await productAPI.update(editingProduct._id, productData);
        if (response?.success) {
          showSuccess(SUCCESS_MESSAGES.PRODUCT.UPDATED);
          // Backend returns product in response.product, not response.data
          if (response.product) {
            setProducts(prev => prev.map(p => p._id === editingProduct._id ? response.product : p));
          }
        }
      } else {
        response = await productAPI.create(productData);
        console.log('Product creation response:', response);
        if (response?.success) {
          showSuccess(SUCCESS_MESSAGES.PRODUCT.CREATED);
          // Backend returns product in response.product, not response.data
          if (response.product) {
            setProducts(prev => [response.product, ...prev]);
          } else {
            console.warn('No product data in response:', response);
          }
        }
      }

      if (response?.success) {
        updateLoadingToast(loadingToastId, SUCCESS_MESSAGES.PRODUCT.SAVED, 'success');
        resetForm();
      }
    } catch (error) {
      const errorMessage = ErrorHandler.getErrorMessage(error);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setValue('title', product.title);
    setValue('description', product.description);
    setValue('price', product.price);
    setValue('category', product.category || '');
    setShowForm(true);
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await productAPI.delete(productId);
      if (response?.success) {
        showSuccess(SUCCESS_MESSAGES.PRODUCT.DELETED);
        setProducts(prev => prev.filter(p => p._id !== productId));
      }
    } catch (error) {
      const errorMessage = ErrorHandler.getErrorMessage(error);
      showError(errorMessage);
    }
  };

  // Reset form
  const resetForm = () => {
    reset();
    setEditingProduct(null);
    setShowForm(false);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Merchant Dashboard</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* Add/Edit Product Form */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h5>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    {...register('title', {
                      required: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD,
                      minLength: {
                        value: 3,
                        message: ERROR_MESSAGES.VALIDATION.MIN_LENGTH('Title', 3),
                      },
                    })}
                    placeholder="Product title"
                  />
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title.message}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                    {...register('price', {
                      required: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD,
                      min: { value: 0, message: 'Price must be positive' },
                    })}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <div className="invalid-feedback">{errors.price.message}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                    {...register('category', {
                      required: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD,
                    })}
                  >
                    <option value="">Select category</option>
                    {PREDEFINED_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <div className="invalid-feedback">{errors.category.message}</div>
                  )}
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    rows="3"
                    {...register('description', {
                      required: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD,
                      minLength: {
                        value: 10,
                        message: ERROR_MESSAGES.VALIDATION.MIN_LENGTH('Description', 10),
                      },
                    })}
                    placeholder="Product description"
                  />
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description.message}</div>
                  )}
                </div>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">My Products</h5>
          {products.length === 0 ? (
            <p className="text-muted">No products yet. Add your first product above.</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.filter(product => product).map((product) => (
                    <tr key={product._id}>
                      <td>{product.title}</td>
                      <td>${Number(product.price).toFixed(2)}</td>
                      <td>{product.category || '-'}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(product._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;
