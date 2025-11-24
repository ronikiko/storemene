# StyleFlow IL - E-commerce Platform

A modern e-commerce platform with React frontend and Node.js/SQLite backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Setup

1. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd ..
   npm install
   ```

3. **Seed the Database**
   ```bash
   cd server
   npm run seed
   ```

### Running the Application

You need to run **both** the backend and frontend servers:

#### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```
The backend will run on **http://localhost:3001**

#### Terminal 2 - Frontend Server
```bash
npm run dev
```
The frontend will run on **http://localhost:5173**

### Admin Access
- **Email:** Any email
- **Password:** `admin123`

### Customer Token Testing
Test customer-specific pricing by adding a token to the URL:
- Regular customer: `http://localhost:5173?token=token_c1_secure_random_string`
- Wholesale customer: `http://localhost:5173?token=token_c2_secure_random_string`
- VIP customer: `http://localhost:5173?token=token_c3_secure_random_string`

## 📁 Project Structure

```
styleflow-il/
├── server/                 # Backend (Node.js + Express + SQLite)
│   ├── src/
│   │   ├── index.js       # Express server
│   │   ├── db.js          # Database connection
│   │   ├── schema.sql     # Database schema
│   │   ├── seed.js        # Seed data
│   │   └── routes/        # API routes
│   ├── database.sqlite    # SQLite database file
│   └── package.json
│
├── src/                   # Frontend (React + TypeScript)
│   ├── components/        # React components
│   ├── services/          # API service layer
│   ├── context/           # React context
│   └── App.tsx           # Main app component
│
└── package.json
```

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Price Lists
- `GET /api/price-lists` - Get all price lists
- `POST /api/price-lists` - Create price list
- `PUT /api/price-lists/:id` - Update price list
- `DELETE /api/price-lists/:id` - Delete price list

### Authentication
- `POST /api/auth/customer` - Authenticate customer by token
- `POST /api/auth/admin` - Admin login

## 🗄️ Database

The application uses SQLite for data storage. The database file is located at `server/database.sqlite`.

To reset the database:
```bash
cd server
rm database.sqlite
npm run seed
```

## 🛠️ Development

### Backend Development
The backend uses `--watch` mode for auto-restart on file changes:
```bash
cd server
npm run dev
```

### Frontend Development
The frontend uses Vite's hot module replacement:
```bash
npm run dev
```

## 📝 Features

- ✅ Product catalog with categories
- ✅ Shopping cart
- ✅ Customer-specific pricing
- ✅ Admin dashboard
- ✅ Category management with icons
- ✅ Product quick view
- ✅ SQLite database backend
- ✅ REST API
- ✅ Toast notifications

## 🔐 Security Note

This is a development application. For production use, implement proper:
- Authentication (JWT tokens)
- Password hashing
- Input validation
- HTTPS
- Environment variables for sensitive data
