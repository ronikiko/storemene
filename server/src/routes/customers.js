import express from 'express'
import { db } from '../db/index.js'
import { customers } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { rivchitService } from '../services/RivchitService.js'

const router = express.Router()

// GET all customers
router.get('/', async (req, res) => {
	const customersList = await rivchitService.customersList()
	console.log(customersList)
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
		const { id, name, email, phone, priceListId, token } = req.body

		const [newCustomer] = await db
			.insert(customers)
			.values({
				id,
				name,
				email,
				phone,
				priceListId: priceListId || null,
				token,
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
		const { name, email, phone, priceListId } = req.body

		const [updatedCustomer] = await db
			.update(customers)
			.set({
				name,
				email,
				phone,
				priceListId: priceListId || null,
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
