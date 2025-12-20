import express from 'express'
import { db } from '../db/index.js'
import { orders, orderItems } from '../db/schema.js'
import { eq, desc } from 'drizzle-orm'
// import rivhitApi from '@api/rivhit-api'
import { rivchitService } from '../services/RivchitService.js'

const router = express.Router()

// GET all orders with items
router.get('/', async (req, res) => {
	try {
		const allOrders = await db
			.select()
			.from(orders)
			.orderBy(desc(orders.createdAt))

		// For each order, fetch items
		const ordersWithItems = await Promise.all(
			allOrders.map(async (order) => {
				const items = await db
					.select()
					.from(orderItems)
					.where(eq(orderItems.orderId, order.id))
				return { ...order, items }
			})
		)

		res.json(ordersWithItems)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// POST create order
router.post('/', async (req, res) => {
	try {
		const {
			id,
			customerId,
			customerName,
			customerPhone,
			customerAddress,
			items,
			totalAmount,
			status,
		} = req.body

		// Insert order
		const [newOrder] = await db
			.insert(orders)
			.values({
				id,
				customerId,
				customerName,
				customerPhone,
				customerAddress,
				totalAmount,
				status: status || 'pending',
			})
			.returning()

		// Insert order items
		if (items && items.length > 0) {
			await Promise.all(
				items.map((item) =>
					db.insert(orderItems).values({
						orderId: id,
						productId: item.productId,
						title: item.title,
						quantity: item.quantity,
						price: item.price,
						total: item.total,
						imageUrl: item.imageUrl,
					})
				)
			)
			const orderData = { customerName, items }
			const rivhitRes = await rivchitService.createNewOrder(orderData)

			if (rivhitRes?.document_link) {
				await db
					.update(orders)
					.set({ documentLink: rivhitRes.document_link })
					.where(eq(orders.id, id))
			}
		}

		// Fetch items and updated order to return complete object
		const [[updatedOrder]] = await Promise.all([
			db.select().from(orders).where(eq(orders.id, id)),
		])

		const savedItems = await db
			.select()
			.from(orderItems)
			.where(eq(orderItems.orderId, id))

		res.status(201).json({ ...updatedOrder, items: savedItems })
	} catch (error) {
		console.error('Error creating order:', error)
		res.status(500).json({ error: error.message })
	}
})

// PUT update order
router.put('/:id', async (req, res) => {
	try {
		const {
			customerId,
			customerName,
			customerPhone,
			customerAddress,
			items,
			totalAmount,
			status,
		} = req.body
		const orderId = req.params.id

		// Update order details
		const [updatedOrder] = await db
			.update(orders)
			.set({
				customerId,
				customerName,
				customerPhone,
				customerAddress,
				totalAmount,
				status,
			})
			.where(eq(orders.id, orderId))
			.returning()

		if (!updatedOrder) {
			return res.status(404).json({ error: 'Order not found' })
		}

		// Update items: Delete old ones and insert new ones
		if (items) {
			await db.delete(orderItems).where(eq(orderItems.orderId, orderId))

			if (items.length > 0) {
				await Promise.all(
					items.map((item) =>
						db.insert(orderItems).values({
							orderId,
							productId: item.productId,
							title: item.title,
							quantity: item.quantity,
							price: item.price,
							total: item.total,
							imageUrl: item.imageUrl,
						})
					)
				)
			}
		}

		// Fetch items to return complete object
		const savedItems = await db
			.select()
			.from(orderItems)
			.where(eq(orderItems.orderId, orderId))

		res.json({ ...updatedOrder, items: savedItems })
	} catch (error) {
		console.error('Error updating order:', error)
		res.status(500).json({ error: error.message })
	}
})

export default router
