import { useState, useEffect, useMemo, lazy } from 'react';
import { useToast } from '../../hooks/useToast';
import { productAPI } from '../../services/api';
import ErrorHandler from '../../utils/errorHandler';
import { debounce } from '../../utils/debounce';
import { PREDEFINED_CATEGORIES } from '../../constants/categories';
import LazyWrapper from '../../components/LazyWrapper';

// Lazy load ProductCard component
const ProductCard = lazy(
  () => import('../../components/ProductCard/ProductCard')
);

const Products = () => {
  const { showError } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // Filters state
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    q: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Debounced search setter
  const setSearchDebounced = useMemo(
    () =>
      debounce((value) => {
        setFilters((prev) => ({ ...prev, q: value }));
        setPage(1);
      }, 500),
    []
  );

  // Update filters when category changes
  useEffect(() => {
    // Reset page when category changes
    setPage(1);
  }, [filters.category]);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page,
        limit,
      };
      // Remove empty params
      Object.keys(params).forEach(
        (key) =>
          (params[key] === '' || params[key] == null) && delete params[key]
      );

      const res = await productAPI.getAll(params);
      if (res?.success) {
        // Backend returns products in res.products, pagination in res.pagination
        setProducts(res.products || []);
        setTotal(res.pagination?.totalDocs || 0);
      }
    } catch (error) {
      showError(ErrorHandler.getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Refetch on dependency changes
  useEffect(() => {
    fetchProducts();
  }, [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.sortBy,
    filters.sortOrder,
    page,
    limit,
    filters.q,
  ]); // Removed fetchProducts from dependencies to prevent infinite re-renders

  // Handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Validate price inputs
    if (name === 'minPrice' || name === 'maxPrice') {
      const numValue = value === '' ? '' : Number(value);
      if (value !== '' && (isNaN(numValue) || numValue < 0)) {
        return; // Don't update if invalid
      }

      // Ensure minPrice is not greater than maxPrice
      if (
        name === 'minPrice' &&
        filters.maxPrice !== '' &&
        numValue !== '' &&
        numValue > Number(filters.maxPrice)
      ) {
        return; // Don't update if min > max
      }
      if (
        name === 'maxPrice' &&
        filters.minPrice !== '' &&
        numValue !== '' &&
        numValue < Number(filters.minPrice)
      ) {
        return; // Don't update if max < min
      }
    }

    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchDebounced(e.target.value);
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className='container mt-4'>
      <div className='d-flex align-items-center justify-content-between mb-3'>
        <h2 className='mb-0'>Products</h2>
        <div style={{ maxWidth: 360, width: '100%' }}>
          <input
            type='text'
            className='form-control'
            placeholder='Search products'
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Filters */}
      <div className='card mb-3'>
        <div className='card-body'>
          {/* Active Filters Display */}
          {Object.values(filters).some(
            (value) => value !== '' && value !== 'createdAt' && value !== 'desc'
          ) && (
            <div className='mb-3 p-2 bg-light rounded'>
              <small className='text-muted'>
                <strong>Active Filters:</strong>
                {filters.category && ` Category: ${filters.category}`}
                {filters.minPrice && ` Min Price: $${filters.minPrice}`}
                {filters.maxPrice && ` Max Price: $${filters.maxPrice}`}
                {filters.q && ` Search: "${filters.q}"`}
                {filters.sortBy !== 'createdAt' && ` Sort: ${filters.sortBy}`}
                {filters.sortOrder !== 'desc' && ` Order: ${filters.sortOrder}`}
              </small>
            </div>
          )}

          <div className='row g-3'>
            <div className='col-md-4'>
              <label className='form-label'>Category</label>
              <select
                name='category'
                className='form-select'
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value=''>All Categories</option>
                {PREDEFINED_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className='col-md-2'>
              <label className='form-label'>Min Price</label>
              <input
                type='number'
                name='minPrice'
                className='form-control'
                placeholder='0'
                min='0'
                step='0.01'
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </div>

            <div className='col-md-2'>
              <label className='form-label'>Max Price</label>
              <input
                type='number'
                name='maxPrice'
                className='form-control'
                placeholder='∞'
                min='0'
                step='0.01'
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>

            <div className='col-md-2'>
              <label className='form-label'>Sort By</label>
              <select
                name='sortBy'
                className='form-select'
                value={filters.sortBy}
                onChange={handleFilterChange}
              >
                <option value='createdAt'>Newest</option>
                <option value='updatedAt'>Recently Updated</option>
                <option value='price'>Price</option>
                <option value='title'>Title</option>
              </select>
            </div>

            <div className='col-md-2'>
              <label className='form-label'>Order</label>
              <select
                name='sortOrder'
                className='form-select'
                value={filters.sortOrder}
                onChange={handleFilterChange}
              >
                <option value='desc'>Desc</option>
                <option value='asc'>Asc</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className='row mt-3'>
            <div className='col-12'>
              <button
                type='button'
                className='btn btn-outline-secondary btn-sm'
                onClick={() => {
                  setFilters({
                    category: '',
                    minPrice: '',
                    maxPrice: '',
                    q: '',
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                  });
                  setPage(1);
                }}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className='text-center py-5'>
          <div className='spinner-border' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className='text-center py-5'>
          <h4 className='text-muted'>No products found</h4>
          <p className='text-muted'>
            Try adjusting your filters or search terms.
          </p>
        </div>
      ) : (
        <>
          <div className='row g-4 mb-4'>
            {products.map((product) => (
              <div key={product._id} className='col-md-6 col-lg-4 col-xl-3'>
                <LazyWrapper>
                  <ProductCard product={product} />
                </LazyWrapper>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label='Products pagination'>
              <ul className='pagination justify-content-center'>
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button
                    className='page-link'
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <li
                      key={pageNum}
                      className={`page-item ${pageNum === page ? 'active' : ''}`}
                    >
                      <button
                        className='page-link'
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  )
                )}

                <li
                  className={`page-item ${page === totalPages ? 'disabled' : ''}`}
                >
                  <button
                    className='page-link'
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
