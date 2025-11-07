const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'database', 'ecom.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.serialize(() => {
  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT,
    description TEXT
  )`);

  // Cart items table
  db.run(`CREATE TABLE IF NOT EXISTS cart_items (
    id TEXT PRIMARY KEY,
    productId TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES products (id)
  )`);

  // Insert sample products if empty
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (row.count === 0) {
      const products = [
        { 
          id: '1', 
          name: 'Wireless Headphones', 
          price: 99.99, 
          image: 'https://picsum.photos/300/300?random=1', 
          description: 'High-quality wireless headphones with noise cancellation' 
        },
        { 
          id: '2', 
          name: 'Smart Watch', 
          price: 199.99, 
          image: 'https://picsum.photos/300/300?random=2', 
          description: 'Feature-rich smartwatch with health monitoring' 
        },
        { 
          id: '3', 
          name: 'Laptop Backpack', 
          price: 49.99, 
          image: 'https://picsum.photos/300/300?random=3', 
          description: 'Durable laptop backpack with USB charging port' 
        },
        { 
          id: '4', 
          name: 'Bluetooth Speaker', 
          price: 79.99, 
          image: 'https://picsum.photos/300/300?random=4', 
          description: 'Portable Bluetooth speaker with rich sound' 
        },
        { 
          id: '5', 
          name: 'Phone Case', 
          price: 24.99, 
          image: 'https://picsum.photos/300/300?random=5', 
          description: 'Protective phone case with stylish design' 
        },
        { 
          id: '6', 
          name: 'Tablet Stand', 
          price: 34.99, 
          image: 'https://picsum.photos/300/300?random=6', 
          description: 'Adjustable tablet stand for comfortable viewing' 
        },
        { 
          id: '7', 
          name: 'USB-C Cable', 
          price: 19.99, 
          image: 'https://picsum.photos/300/300?random=7', 
          description: 'Fast charging USB-C cable 6ft length' 
        },
        { 
          id: '8', 
          name: 'Wireless Mouse', 
          price: 29.99, 
          image: 'https://picsum.photos/300/300?random=8', 
          description: 'Ergonomic wireless mouse with precision tracking' 
        }
      ];

      const stmt = db.prepare("INSERT INTO products (id, name, price, image, description) VALUES (?, ?, ?, ?, ?)");
      products.forEach(product => {
        stmt.run(product.id, product.name, product.price, product.image, product.description);
      });
      stmt.finalize();
      console.log('Sample products inserted successfully');
    }
  });
});

// Routes

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET /api/cart - Get cart items with total
app.get('/api/cart', (req, res) => {
  const query = `
    SELECT 
      ci.id,
      ci.productId,
      ci.quantity,
      p.name,
      p.price,
      p.image,
      (ci.quantity * p.price) as itemTotal
    FROM cart_items ci
    JOIN products p ON ci.productId = p.id
  `;

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const total = rows.reduce((sum, item) => sum + item.itemTotal, 0);
    
    res.json({
      items: rows,
      total: parseFloat(total.toFixed(2))
    });
  });
});

// POST /api/cart - Add item to cart
app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // Check if product exists
  db.get("SELECT * FROM products WHERE id = ?", [productId], (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart
    db.get("SELECT * FROM cart_items WHERE productId = ?", [productId], (err, existingItem) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        db.run(
          "UPDATE cart_items SET quantity = ? WHERE productId = ?",
          [newQuantity, productId],
          function(err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Cart updated successfully', cartItemId: existingItem.id });
          }
        );
      } else {
        // Add new item
        const cartItemId = uuidv4();
        db.run(
          "INSERT INTO cart_items (id, productId, quantity) VALUES (?, ?, ?)",
          [cartItemId, productId, quantity],
          function(err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Item added to cart', cartItemId });
          }
        );
      }
    });
  });
});

// DELETE /api/cart/:id - Remove item from cart
app.delete('/api/cart/:id', (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM cart_items WHERE id = ?", [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.json({ message: 'Item removed from cart' });
  });
});

// POST /api/checkout - Process checkout
app.post('/api/checkout', (req, res) => {
  const { customerInfo } = req.body;

  if (!customerInfo || !customerInfo.name || !customerInfo.email) {
    return res.status(400).json({ error: 'Customer name and email are required' });
  }

  // Get current cart
  db.all(`
    SELECT 
      ci.id,
      ci.productId,
      ci.quantity,
      p.name,
      p.price,
      (ci.quantity * p.price) as itemTotal
    FROM cart_items ci
    JOIN products p ON ci.productId = p.id
  `, (err, cartItems) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const total = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
    const orderId = `ORD-${Date.now()}`;
    const timestamp = new Date().toISOString();

    // Create receipt
    const receipt = {
      orderId,
      customerInfo,
      items: cartItems,
      total: parseFloat(total.toFixed(2)),
      timestamp,
      status: 'confirmed'
    };

    // Clear cart after successful checkout
    db.run("DELETE FROM cart_items", (err) => {
      if (err) {
        console.error('Error clearing cart:', err);
      }
    });

    res.json(receipt);
  });
});

// Update cart item quantity
app.put('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ error: 'Quantity must be greater than 0' });
  }

  db.run(
    "UPDATE cart_items SET quantity = ? WHERE id = ?",
    [quantity, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      res.json({ message: 'Cart item updated successfully' });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});