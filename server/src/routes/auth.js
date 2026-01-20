import express from 'express'
import { db } from '../db/index.js'
import { customers, users } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { authMiddleware } from '../authMiddleware.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// POST authenticate customer by token
router.post('/customer', async (req, res) => {
	try {
		const { token } = req.body

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

		res.json(customer)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
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
