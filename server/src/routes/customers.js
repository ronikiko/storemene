import express from 'express'
import { db } from '../db/index.js'
import { customers } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { adminMiddleware } from '../authMiddleware.js'
import { whatsAppService } from '../services/index.js'

const router = express.Router()

router.use(adminMiddleware)

// GET all customers
router.get('/', async (req, res) => {
	// TODO: ask avi if he wants the consomer list from rivchit
	// if yes, implement it
	// const customersList = await rivchitService.customersList()
	try {
		const allCustomers = await db.select().from(customers)
		res.json(allCustomers)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// GET single customer
router.get('/:id', async (req, res) => {
	try {
		const [customer] = await db
			.select()
			.from(customers)
			.where(eq(customers.id, req.params.id))

		if (!customer) {
			return res.status(404).json({ error: 'Customer not found' })
		}
		res.json(customer)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// POST create customer
router.post('/', async (req, res) => {
	try {
		const { id, name, email, phone, priceListId, token, pin } = req.body

		const [newCustomer] = await db
			.insert(customers)
			.values({
				id,
				name,
				email,
				phone,
				priceListId: priceListId || null,
				token,
				pin,
			})
			.returning()

		res.status(201).json(newCustomer)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// PUT update customer
router.put('/:id', async (req, res) => {
	try {
		const { name, email, phone, priceListId, pin } = req.body

		const [updatedCustomer] = await db
			.update(customers)
			.set({
				name,
				email,
				phone,
				priceListId: priceListId || null,
				pin,
			})
			.where(eq(customers.id, req.params.id))
			.returning()

		if (!updatedCustomer) {
			return res.status(404).json({ error: 'Customer not found' })
		}

		res.json(updatedCustomer)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// SEND WhatsApp invitation
router.post('/invite/:id', async (req, res) => {
	try {
		const [customer] = await db
			.select()
			.from(customers)
			.where(eq(customers.id, req.params.id))

		if (!customer) {
			return res.status(404).json({ error: 'Customer not found' })
		}

		if (!customer.phone) {
			return res.status(400).json({ error: 'Customer has no phone number' })
		}

		const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
		const inviteLink = `${frontendUrl}?token=${customer.token}`
		const message = `שלום ${customer.name}!\nהזמנו אותך לצפות בקטלוג החדש שלנו.\n\nלינק אישי: ${inviteLink}\nקוד כניסה (PIN): ${customer.pin}\n\nנשמח לראות אותך!`

		const response = await whatsAppService.sendMessage(customer.phone, message)

		res.json({ success: true, response })
	} catch (error) {
		console.error('WhatsApp Error:', error)
		res.status(500).json({ error: error.message })
	}
})

// DELETE customer
router.delete('/:id', async (req, res) => {
	try {
		const [deletedCustomer] = await db
			.delete(customers)
			.where(eq(customers.id, req.params.id))
			.returning()

		if (!deletedCustomer) {
			return res.status(404).json({ error: 'Customer not found' })
		}

		res.json({ message: 'Customer deleted successfully' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

export default router
