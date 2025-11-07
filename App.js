import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

// Fallback image for broken images
const fallbackImage =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwSDEwMFYyMDBIMTAwVjEwMFoiIGZpbGw9IiNDOEM4QzgiLz48L3N2Zz4KPC9zdmc+';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load hardcoded products + cart
  useEffect(() => {
    setProducts([
      {
        id: 1,
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation.',
        price: 99.99,
        image:
          'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQu7aWxoRBjNel9cJuuzYDNQSlnex3MEakdHEYZnVwP4l7K1OSjoUkQYvbb7MUH9SvdbR1f1kKeP_BUpxLcK0NHzcg2QA8kvuLsdLX_EgkacOnZY-7djEI8',
      },
      {
        id: 2,
        name: 'Smart Watch',
        description:
          'Feature-rich smartwatch with heart rate and sleep tracking.',
        price: 199.99,
        image:
          'https://m.media-amazon.com/images/I/41g06cAmgkL._SY300_SX300_QL70_FMwebp_.jpg',
      },
      {
        id: 3,
        name: 'USB-C Cable',
        description:
          'Fast charging 6ft USB-C cable with durable braided design.',
        price: 9.99,
        image:
          'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MQKJ3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=UmJ0VnhkMm9DbDhxclVzaXlNbnVRUWtuVHYzMERCZURia3c5SzJFOTlPaEdPNk5TZkUyRjVjbmZlVkFhb3BFYmQzOU5RUU0yVjg1T0JNOVNCMVhGU0E',
      },
      {
        id: 4,
        name: 'Bluetooth Speaker',
        description:
          'Portable Bluetooth speaker with rich bass and 10-hour battery.',
        price: 49.99,
        image:
          'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQOuEg-l8T5Ow7xXOogyyHoednPjALEZpBv2fBYyRdNpBUR0QEq_PSX7gNKK2Ru8W3Gdy-uaIMs_DCwt3jNufKAFHHNn5RCnU1OIscY42px5Ko6nvwB8OQyNQ',
      },
      {
        id: 5,
        name: 'Gaming Mouse',
        description: 'Ergonomic RGB gaming mouse with 6 programmable buttons.',
        price: 39.99,
        image:
          'https://www.bbassets.com/media/uploads/p/l/40325605_1-zebronics-ms-optical-usb-gaming-mouse-phero.jpg',
      },
      {
        id: 6,
        name: 'Mechanical Keyboard',
        description:
          'RGB mechanical keyboard with blue switches and metal body.',
        price: 89.99,
        image:
          'https://m.media-amazon.com/images/I/717OAh8m-gL._SX679_.jpg',
      },
      {
        id: 7,
        name: 'Laptop Stand',
        description:
          'Adjustable aluminum laptop stand for better posture and cooling.',
        price: 29.99,
        image:
          'https://m.media-amazon.com/images/I/51mN-RUnn5L._SX679_.jpg',
      },
      {
        id: 8,
        name: 'Wireless Charger',
        description:
          'Fast wireless charging pad compatible with iPhone & Android.',
        price: 24.99,
        image:
          'https://www.bbassets.com/media/uploads/p/l/40326660_1-dubstep-powerblitz-x1-10000-mah-20w-12w-fast-charging-wired-wireless-compatible-with-magsafe-devices-compact-pocket-size-power-bank-with-type-c-to-type-c-cable-black.jpg',
      },
    ]);

    fetchCart();
  }, []);

  // Fetch products (if backend available)
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch cart
  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_BASE}/cart`);
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Add to cart
  const addToCart = async (productId) => {
    try {
      await axios.post(`${API_BASE}/cart`, { productId, quantity: 1 });
      fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Remove from cart
  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`${API_BASE}/cart/${cartItemId}`);
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Update quantity
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(`${API_BASE}/cart/${cartItemId}`, { quantity: newQuantity });
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Checkout
  const handleCheckout = async (customerInfo) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/checkout`, { customerInfo });
      setReceipt(response.data);
      setShowCheckout(false);
      fetchCart();
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Checkout failed. Please try again.');
    }
    setLoading(false);
  };

  // Image error fallback
  const handleImageError = (e) => {
    e.target.src = fallbackImage;
    e.target.onerror = null;
  };

  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <h1>Vibe Commerce</h1>
        <button className="cart-button" onClick={() => setShowCart(true)}>
          Cart ({cartItemCount})
        </button>
      </header>

      {/* Product Section */}
      <main className="main-content">
        <h2>Products</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} onError={handleImageError} />
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price}</p>
              <button className="add-to-cart-btn" onClick={() => addToCart(product.id)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Modals */}
      {showCart && (
        <CartModal
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onCheckout={() => setShowCheckout(true)}
          onImageError={handleImageError}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onSubmit={handleCheckout}
          loading={loading}
        />
      )}

      {receipt && <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
}

/* ---------------- CART MODAL ---------------- */
function CartModal({ cart, onClose, onRemove, onUpdateQuantity, onCheckout, onImageError }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Shopping Cart</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cart-content">
          {cart.items.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} onError={onImageError} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>${item.price}</p>
                    </div>
                    <div className="quantity-controls">
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <div className="item-total">${(item.quantity * item.price).toFixed(2)}</div>
                    <button className="remove-btn" onClick={() => onRemove(item.id)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <strong>Total: ${cart.total.toFixed(2)}</strong>
                <button className="checkout-btn" onClick={onCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- CHECKOUT MODAL ---------------- */
function CheckoutModal({ onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({ name: '', email: '', address: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Checkout</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <textarea name="address" value={formData.address} onChange={handleChange} required />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------- RECEIPT MODAL ---------------- */
function ReceiptModal({ receipt, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal receipt-modal">
        <div className="modal-header">
          <h2>Order Confirmed!</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="receipt-content">
          <div className="receipt-header">
            <p>
              <strong>Order ID:</strong> {receipt.orderId}
            </p>
            <p>
              <strong>Date:</strong> {new Date(receipt.timestamp).toLocaleString()}
            </p>
          </div>

          <div className="customer-info">
            <h4>Customer Information</h4>
            <p>
              <strong>Name:</strong> {receipt.customerInfo.name}
            </p>
            <p>
              <strong>Email:</strong> {receipt.customerInfo.email}
            </p>
          </div>

          <div className="receipt-items">
            <h4>Order Items</h4>
            {receipt.items.map((item) => (
              <div key={item.id} className="receipt-item">
                <span>
                  {item.name} (x{item.quantity})
                </span>
                <span>${(item.quantity * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="receipt-total">
            <strong>Total: ${receipt.total.toFixed(2)}</strong>
          </div>

          <div className="receipt-footer">
            <p>Thank you for your purchase!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
