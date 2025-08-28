import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Dashboard component
const Dashboard = () => {
  const { user, logout, isMerchant, isCustomer } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className='container mt-4'>
      <div className='row'>
        <div className='col-12'>
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <h1>Welcome, {user?.name}!</h1>
            <button onClick={handleLogout} className='btn btn-outline-danger'>
              Logout
            </button>
          </div>

          <div className='card'>
            <div className='card-body'>
              <h5 className='card-title'>Account Information</h5>
              <div className='row'>
                <div className='col-md-6'>
                  <p>
                    <strong>Name:</strong> {user?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p>
                    <strong>Role:</strong>
                    <span
                      className={`badge ms-2 ${isMerchant ? 'bg-success' : 'bg-primary'}`}
                    >
                      {user?.role}
                    </span>
                  </p>
                </div>
                <div className='col-md-6'>
                  <div className='alert alert-info'>
                    <h6>
                      Account Type: {isMerchant ? 'Merchant' : 'Customer'}
                    </h6>
                    {isMerchant && (
                      <p className='mb-0'>
                        As a merchant, you can create and manage products for
                        your store.
                      </p>
                    )}
                    {isCustomer && (
                      <p className='mb-0'>
                        As a customer, you can browse and purchase products from
                        merchants.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-4'>
            <h3>Quick Actions</h3>
            <div className='row'>
              {isMerchant && (
                <>
                  <div className='col-md-4 mb-3'>
                    <div className='card text-center'>
                      <div className='card-body'>
                        <h5 className='card-title'>Manage Products</h5>
                        <p className='card-text'>
                          Add, edit, or remove your products
                        </p>
                        <Link
                          to='/merchant-dashboard'
                          className='btn btn-primary'
                        >
                          Go to Merchant Dashboard
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-4 mb-3'>
                    <div className='card text-center'>
                      <div className='card-body'>
                        <h5 className='card-title'>View Orders</h5>
                        <p className='card-text'>
                          Check customer orders and manage them
                        </p>
                        <button className='btn btn-success'>View Orders</button>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-4 mb-3'>
                    <div className='card text-center'>
                      <div className='card-body'>
                        <h5 className='card-title'>Analytics</h5>
                        <p className='card-text'>View your store performance</p>
                        <button className='btn btn-info'>View Analytics</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {isCustomer && (
                <>
                  <div className='col-md-4 mb-3'>
                    <div className='card text-center'>
                      <div className='card-body'>
                        <h5 className='card-title'>Browse Products</h5>
                        <p className='card-text'>
                          Explore products from merchants
                        </p>
                        <Link to='/products' className='btn btn-primary'>
                          Browse Products
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-4 mb-3'>
                    <div className='card text-center'>
                      <div className='card-body'>
                        <h5 className='card-title'>My Orders</h5>
                        <p className='card-text'>View your order history</p>
                        <button className='btn btn-success'>My Orders</button>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-4 mb-3'>
                    <div className='card text-center'>
                      <div className='card-body'>
                        <h5 className='card-title'>Wishlist</h5>
                        <p className='card-text'>Save products for later</p>
                        <button className='btn btn-info'>My Wishlist</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
