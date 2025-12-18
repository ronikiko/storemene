import express from 'express'
import { db } from '../db/index.js'
import { orders, orderItems } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import rivhitApi from '@api/rivhit-api'

const router = express.Router()

// GET all orders with items
router.get('/', async (req, res) => {
	try {
		const allOrders = await db.select().from(orders).orderBy(orders.createdAt)

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
			const rivhitRes = await rivhitApi.postOnlineRivhitonlineapiSvcDocumentNew(
				{
					items: [
						...items.map((item, index) => ({
							item_id: index + 1,
							catalog_number: item.productId,
							quantity: item.quantity,
							price_nis: item.price,
							price_mtc: item.price,
							description: item.title,
						})),
					],
					api_token: 'DECD03E5-E35C-41E8-84F7-FBA2FB483928',
					first_name: customerName,
					last_name: 'israel',
					customer_id: 0,
					document_type: 7,
				}
			)
			console.log('Rivhit API Response:', rivhitRes)

			if (rivhitRes?.data?.data?.document_link) {
				await db
					.update(orders)
					.set({ documentLink: rivhitRes.data.data.document_link })
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

// PUT update order status
router.put('/:id', async (req, res) => {
	try {
		const { status } = req.body
		const [updatedOrder] = await db
			.update(orders)
			.set({ status })
			.where(eq(orders.id, req.params.id))
			.returning()

		if (!updatedOrder) {
			return res.status(404).json({ error: 'Order not found' })
		}

		// Fetch items
		const items = await db
			.select()
			.from(orderItems)
			.where(eq(orderItems.orderId, req.params.id))

		res.json({ ...updatedOrder, items })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

export default router
