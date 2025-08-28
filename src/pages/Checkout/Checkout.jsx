import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../hooks/useToast';

const Checkout = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();
  const { showSuccess } = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = () => {
    // Simple demo - just show success message
    showSuccess('Your product is ready to ship! Thank you!');
    setShowPaymentModal(false);
    clearCart();
  };

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  if (cart.length === 0) {
    return (
      <div className='container mt-4'>
        <div className='text-center py-5'>
          <h3>Your cart is empty</h3>
          <p className='text-muted'>
            Add some products to your cart to continue shopping.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mt-4'>
      <h2 className='mb-4'>Checkout</h2>

      <div className='row'>
        {/* Cart Items */}
        <div className='col-md-8'>
          <div className='card mb-4'>
            <div className='card-header'>
              <h5 className='mb-0'>Cart Items ({cart.length})</h5>
            </div>
            <div className='card-body'>
              {cart.map((item) => (
                <div
                  key={item._id}
                  className='d-flex align-items-center border-bottom py-3'
                >
                  <div className='flex-grow-1'>
                    <h6 className='mb-1'>{item.title}</h6>
                    <p className='text-muted mb-1'>{item.description}</p>
                    <span className='badge bg-primary me-2'>
                      {item.category}
                    </span>
                    <span className='text-success fw-bold'>
                      ${Number(item.price).toFixed(2)}
                    </span>
                  </div>
                  <div className='d-flex align-items-center me-3'>
                    <label className='me-2'>Qty:</label>
                    <input
                      type='number'
                      min='1'
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item._id, parseInt(e.target.value))
                      }
                      className='form-control form-control-sm'
                      style={{ width: '60px' }}
                    />
                  </div>
                  <div className='text-end me-3'>
                    <div className='fw-bold'>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <button
                    className='btn btn-outline-danger btn-sm'
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Address */}
        <div className='col-md-4'>
          <div className='card mb-4'>
            <div className='card-header'>
              <h5 className='mb-0'>Order Summary</h5>
            </div>
            <div className='card-body'>
              <div className='d-flex justify-content-between mb-2'>
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className='d-flex justify-content-between mb-2'>
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className='d-flex justify-content-between fw-bold'>
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className='card'>
            <div className='card-header'>
              <h5 className='mb-0'>Shipping Address</h5>
            </div>
            <div className='card-body'>
              <form>
                <div className='mb-3'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Full Name'
                    name='fullName'
                    value={address.fullName}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Street Address'
                    name='street'
                    value={address.street}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className='row mb-3'>
                  <div className='col'>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='City'
                      name='city'
                      value={address.city}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className='col'>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='State'
                      name='state'
                      value={address.state}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                </div>
                <div className='row mb-3'>
                  <div className='col'>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='ZIP Code'
                      name='zipCode'
                      value={address.zipCode}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className='col'>
                    <input
                      type='tel'
                      className='form-control'
                      placeholder='Phone'
                      name='phone'
                      value={address.phone}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                </div>
                <button
                  type='button'
                  className='btn btn-success w-100'
                  onClick={() => setShowPaymentModal(true)}
                  disabled={
                    !address.fullName ||
                    !address.street ||
                    !address.city ||
                    !address.state ||
                    !address.zipCode ||
                    !address.phone
                  }
                >
                  Proceed to Payment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div
          className='modal fade show d-block'
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Payment</h5>
                <button
                  type='button'
                  className='btn-close'
                  onClick={() => setShowPaymentModal(false)}
                ></button>
              </div>
              <div className='modal-body'>
                <p>
                  This is a demo project. Click "Confirm Payment" to simulate a
                  successful payment.
                </p>
                <div className='alert alert-info'>
                  <strong>Order Total:</strong> ${getCartTotal().toFixed(2)}
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className='btn btn-success'
                  onClick={handlePayment}
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
