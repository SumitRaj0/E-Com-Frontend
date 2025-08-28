import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';

// Product card component for displaying product information
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product);
    showSuccess(`${product.title} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product);
    showSuccess(`${product.title} added to cart!`);

    if (isAuthenticated) {
      // If user is logged in, go directly to checkout
      navigate('/checkout');
    } else {
      // If user is not logged in, redirect to login first
      navigate('/login');
    }
  };

  return (
    <div className='card h-100'>
      <div className='card-body d-flex flex-column'>
        <h5 className='card-title'>{product.title}</h5>
        <p className='card-text text-muted mb-2'>
          {product.description?.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </p>

        <div className='mt-auto'>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <span className='badge bg-primary'>
              {product.category || 'Uncategorized'}
            </span>
            <span className='h5 mb-0 text-success'>
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <div className='d-grid gap-2'>
            <button
              className='btn btn-primary btn-sm'
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button className='btn btn-success btn-sm' onClick={handleBuyNow}>
              {isAuthenticated ? 'Buy Now' : 'Login to Buy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
