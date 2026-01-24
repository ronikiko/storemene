import express from 'express'
import { db } from '../db/index.js'
import { orders, orderItems } from '../db/schema.js'
import { eq, desc } from 'drizzle-orm'
import crypto from 'crypto'
import {
	telegramService,
	whatsAppService,
	rivchitService,
} from '../services/index.js'

const MANAGER_PHONE = process.env.MANAGER_PHONE || '972543087670'
const FRONTEND_URL =
	process.env.NODE_ENV === 'develpment'
		? 'http://localhost:3002'
		: process.env.FRONTEND_URL ||
			'https://storemene-u4yv-git-main-ronikikos-projects.vercel.app'

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
			}),
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
			discountPercent,
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
				discountPercent: discountPercent || 0,
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
						discountPercent: item.discountPercent || 0,
						total: item.total,
						imageUrl: item.imageUrl,
					}),
				),
			)
			const orderData = { customerName, items, totalAmount, discountPercent }
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

// GET order by picking token
router.get('/picking/:token', async (req, res) => {
	try {
		const [order] = await db
			.select()
			.from(orders)
			.where(eq(orders.pickingToken, req.params.token))

		if (!order) {
			return res.status(404).json({ error: 'Order not found' })
		}

		const items = await db
			.select()
			.from(orderItems)
			.where(eq(orderItems.orderId, order.id))

		res.json({ ...order, items })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// POST complete picking
router.post('/picking/:token/complete', async (req, res) => {
	try {
		const { itemsStatus } = req.body // Array of { id: itemId, status: 'collected' | 'out_of_stock' }
		const token = req.params.token

		const [order] = await db
			.select()
			.from(orders)
			.where(eq(orders.pickingToken, token))

		if (!order) {
			return res.status(404).json({ error: 'Order not found' })
		}

		// Update items status and quantities
		await Promise.all(
			itemsStatus.map(async (item) => {
				const [currentItem] = await db
					.select()
					.from(orderItems)
					.where(eq(orderItems.id, item.id))

				if (currentItem) {
					// Recalculate item total based on picked quantity
					const pickedQty = item.pickedQuantity ?? currentItem.quantity
					const itemTotal =
						pickedQty *
						currentItem.price *
						(1 - (currentItem.discountPercent || 0) / 100)

					await db
						.update(orderItems)
						.set({
							pickingStatus: item.status,
							pickedQuantity: pickedQty,
							quantity: pickedQty, // Sync original quantity to picked quantity
							total: itemTotal, // Sync item total
						})
						.where(eq(orderItems.id, item.id))
				}
			}),
		)

		// Recalculate order total from all items
		const allItems = await db
			.select()
			.from(orderItems)
			.where(eq(orderItems.orderId, order.id))

		const newTotalSum = allItems.reduce(
			(sum, item) => sum + (item.total || 0),
			0,
		)

		// Update order status and total amount
		const [updatedOrder] = await db
			.update(orders)
			.set({
				status: 'ready_for_shipping',
				totalAmount: newTotalSum,
			})
			.where(eq(orders.id, order.id))
			.returning()

		res.json(updatedOrder)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// PUT update order (with WhatsApp trigger)
router.put('/:id', async (req, res) => {
	try {
		const {
			customerId,
			customerName,
			customerPhone,
			customerAddress,
			items,
			totalAmount,
			discountPercent,
			status,
		} = req.body
		const orderId = req.params.id

		// Fetch current order to check status change
		const [currentOrder] = await db
			.select()
			.from(orders)
			.where(eq(orders.id, orderId))
		if (!currentOrder) {
			return res.status(404).json({ error: 'Order not found' })
		}

		let pickingToken = currentOrder.pickingToken
		if (status === 'processing' && !pickingToken) {
			pickingToken = crypto.randomBytes(16).toString('hex')
		}

		// Update order details
		const [updatedOrder] = await db
			.update(orders)
			.set({
				customerId,
				customerName,
				customerPhone,
				customerAddress,
				totalAmount,
				discountPercent: discountPercent || 0,
				status,
				pickingToken,
			})
			.where(eq(orders.id, orderId))
			.returning()

		// Trigger WhatsApp if status changed to 'processing'
		if (status === 'processing' && currentOrder.status !== 'processing') {
			const pickingUrl = `${FRONTEND_URL}/picker/${pickingToken}`
			const message = `🔔 הזמנה חדשה בטיפול: ${orderId}\nלקוח: ${customerName}\nלינק לליקוט: ${pickingUrl}`
			const encodedMessage = encodeURIComponent(message)
			const waLink = `https://wa.me/${MANAGER_PHONE}?text=${encodedMessage}`

			// Since we can't "send" WhatsApp message directly from node without a provider,
			// we return the link to the frontend for the admin to click, or we log it.
			// Actually, the user said "שהמערכת אוטומטית תשלח".
			// In a real scenario we'd use an API. For now I'll include the link in the response
			// so the frontend can potentially open it or show a button.
			// But the requirement says "automatically send".
			console.log('--- WhatsApp Notification Required ---')
			console.log(`URL: ${waLink}`)
			console.log('--------------------------------------')
			updatedOrder.whatsAppLink = waLink
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
							discountPercent: item.discountPercent || 0,
							total: item.total,
							imageUrl: item.imageUrl,
							pickingStatus: item.pickingStatus || 'pending',
							pickedQuantity: item.pickedQuantity,
						}),
					),
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

// GET picking link for an order
router.get('/:id/picking-link', async (req, res) => {
	try {
		const orderId = req.params.id
		const [order] = await db.select().from(orders).where(eq(orders.id, orderId))

		if (!order) {
			return res.status(404).json({ error: 'Order not found' })
		}

		let pickingToken = order.pickingToken
		if (!pickingToken) {
			pickingToken = crypto.randomBytes(16).toString('hex')
			await db
				.update(orders)
				.set({ pickingToken })
				.where(eq(orders.id, orderId))
		}

		const pickingUrl = `${FRONTEND_URL}/picker/${pickingToken}`
		const message = `🔔 תזכורת ליקוט הזמנה: ${orderId}\nלקוח: ${order.customerName}\n\n
		לינק לליקוט: ${pickingUrl}`
		// const encodedMessage = encodeURIComponent(message)
		// const waLink = `https://wa.me/${MANAGER_PHONE}?text=${encodedMessage}`

		const result = await telegramService.sendMessage(message)
		// const result = await whatsAppService.sendMessage(MANAGER_PHONE, message)
		// const result = await whatsAppService.sendTemplateMessage(
		// 	MANAGER_PHONE,
		// 	'sample_issue_resolution',
		// 	'en_US',
		// 	[
		// 		{
		// 			type: 'body',
		// 			parameters: [
		// 				{
		// 					type: 'text',
		// 					text: orderId,
		// 				},
		// 			],
		// 		},
		// 	],
		// )

		res.json({ whatsAppLink: waLink, pickingToken })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

export default router
