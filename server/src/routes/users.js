import express from 'express'
import { db } from '../db/index.js'
import { users } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { adminMiddleware } from '../authMiddleware.js'

const router = express.Router()

// All user routes are protected by adminMiddleware
router.use(adminMiddleware)

// GET all users (limited info)
router.get('/', async (req, res) => {
	try {
		const allUsers = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				role: users.role,
				createdAt: users.createdAt,
			})
			.from(users)
		res.json(allUsers)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// POST create new user
router.post('/', async (req, res) => {
	try {
		const { name, email, password, role } = req.body

		if (!name || !email || !password) {
			return res.status(400).json({ error: 'Missing required fields' })
		}

		const passwordHash = await bcrypt.hash(password, 10)

		const [newUser] = await db
			.insert(users)
			.values({
				name,
				email,
				passwordHash,
				role: role || 'admin',
			})
			.returning({
				id: users.id,
				name: users.name,
				email: users.email,
				role: users.role,
			})

		res.status(201).json(newUser)
	} catch (error) {
		if (error.code === '23505') {
			// Postgres unique violation
			return res.status(400).json({ error: 'Email already exists' })
		}
		res.status(500).json({ error: error.message })
	}
})

export default router
