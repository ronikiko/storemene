import express from 'express'
import { db } from '../db/index.js'
import { customers, users } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { authMiddleware } from '../authMiddleware.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// GET public customer info for PIN modal
router.get('/customer/info/:token', async (req, res) => {
	try {
		const { token } = req.params
		const [customer] = await db
			.select({ name: customers.name, token: customers.token })
			.from(customers)
			.where(eq(customers.token, token))

		if (!customer) {
			return res.status(404).json({ error: 'Customer not found' })
		}

		res.json(customer)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// POST authenticate customer by token and pin
router.post('/customer', async (req, res) => {
	try {
		const { token, pin } = req.body

		if (!token) {
			return res.status(400).json({ error: 'Token is required' })
		}

		const [customer] = await db
			.select()
			.from(customers)
			.where(eq(customers.token, token))

		if (!customer) {
			return res.status(404).json({ error: 'Customer not found' })
		}

		// Verify PIN
		if (!pin || customer.pin !== pin) {
			return res.status(401).json({ error: 'Invalid PIN' })
		}

		// Create JWT token for customer
		const jwtToken = jwt.sign(
			{
				id: customer.id,
				name: customer.name,
				type: 'customer',
				token: customer.token,
				priceListId: customer.priceListId,
			},
			JWT_SECRET,
			{ expiresIn: '30d' },
		)

		// Set secure HTTP-only cookie
		res.cookie('customer_token', jwtToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
		})

		res.json(customer)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// GET current customer info
router.get('/customer/me', authMiddleware, async (req, res) => {
	if (!req.isCustomer) {
		return res.status(403).json({ error: 'Customer access required' })
	}
	res.json(req.user)
})

// POST admin login
router.post('/admin/login', async (req, res) => {
	try {
		const { email, password } = req.body

		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password are required' })
		}

		const [user] = await db.select().from(users).where(eq(users.email, email))

		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' })
		}

		const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

		if (!isPasswordValid) {
			return res.status(401).json({ error: 'Invalid credentials' })
		}

		const token = jwt.sign(
			{ id: user.id, email: user.email, role: user.role, name: user.name },
			JWT_SECRET,
			{ expiresIn: '24h' },
		)

		// Set secure HTTP-only cookie
		res.cookie('admin_token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		})

		res.json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
			},
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// GET current admin user info
router.get('/admin/me', authMiddleware, async (req, res) => {
	res.json(req.user)
})

// POST logout
router.post('/admin/logout', (req, res) => {
	res.clearCookie('admin_token')
	res.json({ success: true, message: 'Logged out successfully' })
})

export default router
