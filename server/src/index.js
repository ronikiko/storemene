import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import customersRouter from './routes/customers.js';
import priceListsRouter from './routes/priceLists.js';
import authRouter from './routes/auth.js';
import settingsRouter from './routes/settings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/customers', customersRouter);
app.use('/api/price-lists', priceListsRouter);
app.use('/api/auth', authRouter);
app.use('/api/settings', settingsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ API available at http://localhost:${PORT}/api`);
});
