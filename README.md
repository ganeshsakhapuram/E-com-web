# Vibe Commerce - Full Stack E-Commerce Cart

A modern, full-stack shopping cart application built with React, Node.js, and SQLite. Features product catalog, cart management, and checkout process with persistent data storage.

## 🚀 Features

### Frontend (React)
- **Product Catalog**: Responsive grid layout with product cards
- **Shopping Cart**: Real-time cart management with quantity controls
- **Checkout Process**: Customer information form with validation
- **Order Confirmation**: Receipt generation with order details
- **Responsive Design**: Mobile-first approach works on all devices

### Backend (Node.js/Express)
- **RESTful APIs**: Complete CRUD operations for products and cart
- **SQLite Database**: Persistent data storage with foreign key relationships
- **Error Handling**: Comprehensive error management and validation
- **CORS Enabled**: Cross-origin resource sharing for frontend-backend communication

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Hooks
- Axios for API calls
- CSS3 with Flexbox/Grid
- Responsive design

**Backend:**
- Node.js with Express.js
- SQLite database
- UUID for unique identifiers
- CORS middleware

## 📁 Project Structure

```
ecom-cart/
├── backend/
│   ├── server.js          # Express server & API routes
│   ├── package.json       # Backend dependencies
│   └── database/          # SQLite database (auto-created)
└── frontend/
    ├── src/
    │   ├── App.js         # Main React component
    │   ├── App.css        # Stylesheets
    │   └── index.js       # React entry point
    ├── public/
    │   └── index.html     # HTML template
    └── package.json       # Frontend dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation & Running

1. **Clone the repository**
```bash
git clone <repository-url>
cd ecom-cart
```

2. **Setup Backend**
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000`

3. **Setup Frontend** (in new terminal)
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/cart` | Get cart items with total |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:id` | Update item quantity |
| DELETE | `/api/cart/:id` | Remove item from cart |
| POST | `/api/checkout` | Process order & generate receipt |

## 🎯 Usage

1. **Browse Products**: View the product catalog on the homepage
2. **Add to Cart**: Click "Add to Cart" on any product
3. **Manage Cart**: Click cart icon to view/modify items
4. **Adjust Quantities**: Use +/- buttons in cart modal
5. **Checkout**: Fill customer form and submit order
6. **Order Confirmation**: View receipt with order details

## 🗃️ Database Schema

**Products Table:**
- id (TEXT PRIMARY KEY)
- name (TEXT)
- price (REAL)
- image (TEXT)
- description (TEXT)

**Cart Items Table:**
- id (TEXT PRIMARY KEY)
- productId (TEXT FOREIGN KEY)
- quantity (INTEGER)
- addedAt (DATETIME)

## 🎨 Features Demonstrated

- ✅ Full-stack architecture
- ✅ REST API design
- ✅ Database integration
- ✅ State management with React Hooks
- ✅ Responsive UI/UX
- ✅ Form validation
- ✅ Error handling
- ✅ Real-time cart updates
- ✅ Order processing
- ✅ Data persistence

## 🐛 Troubleshooting

**Common Issues:**
- **Port conflicts**: Ensure ports 3000 and 5000 are available
- **CORS errors**: Verify backend is running on port 5000
- **Image loading**: Backend uses Picsum Photos for product images
- **Database issues**: Delete `backend/database` folder and restart

**Reset Application:**
```bash
# Clear database and restart
rm -rf backend/database
mkdir backend/database
npm run dev
```

## 📝 License

This project is created for educational and demonstration purposes.

## 👨‍💻 Developer

Built as a full-stack coding assignment demonstrating modern web development practices.

---

**Note**: This is a mock e-commerce application for screening purposes. No real payments are processed.
