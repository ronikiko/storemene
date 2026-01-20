import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import productsRouter from './routes/products.js'
import categoriesRouter from './routes/categories.js'
import customersRouter from './routes/customers.js'
import priceListsRouter from './routes/priceLists.js'
import authRouter from './routes/auth.js'
import settingsRouter from './routes/settings.js'
import ordersRouter from './routes/orders.js'
import usersRouter from './routes/users.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
const allowedOrigins = [
	'http://localhost:3000',
	'http://127.0.0.1:3000',
	'http://localhost:5173', // Common Vite port
	process.env.FRONTEND_URL,
].filter(Boolean)

app.use(
	cors({
		origin: function (origin, callback) {
			// Allow requests with no origin (like mobile apps, curl, or same-origin)
			if (!origin) return callback(null, true)

			if (
				allowedOrigins.includes(origin) ||
				origin.includes('localhost') ||
				origin.includes('127.0.0.1')
			) {
				return callback(null, true)
			}

			console.warn(`CORS blocked for origin: ${origin}`)
			return callback(new Error('Not allowed by CORS'))
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
	}),
)
app.use(cookieParser())
app.use(express.json())

// Routes
app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/customers', customersRouter)
app.use('/api/price-lists', priceListsRouter)
app.use('/api/auth', authRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/users', usersRouter)

// Health check
app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', message: 'Server is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).json({ error: 'Something went wrong!', message: err.message })
})

// Start server
app.listen(PORT, () => {
	console.log(`✓ Server running on http://localhost:${PORT}`)
	console.log(`✓ API available at http://localhost:${PORT}/api`)
})
