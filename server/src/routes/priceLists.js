import express from 'express'
import { db } from '../db/index.js'
import { priceLists, priceListItems } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { authMiddleware, adminMiddleware } from '../authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

// GET all price lists with their items
router.get('/', adminMiddleware, async (req, res) => {
	try {
		const allPriceLists = await db.select().from(priceLists)

		// Get items for each price list
		const priceListsWithItems = await Promise.all(
			allPriceLists.map(async (pl) => {
				const items = await db
					.select()
					.from(priceListItems)
					.where(eq(priceListItems.priceListId, pl.id))

				const prices = {}
				items.forEach((item) => {
					prices[item.productId] = item.price
				})

				return { ...pl, prices }
			}),
		)

		res.json(priceListsWithItems)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// GET single price list
router.get('/:id', async (req, res) => {
	try {
		// Allow if Admin OR if this is the customer's price list
		if (!req.isAdmin && req.user.priceListId !== req.params.id) {
			return res.status(403).json({ error: 'Access denied' })
		}
		const [priceList] = await db
			.select()
			.from(priceLists)
			.where(eq(priceLists.id, req.params.id))

		if (!priceList) {
			return res.status(404).json({ error: 'Price list not found' })
		}

		const items = await db
			.select()
			.from(priceListItems)
			.where(eq(priceListItems.priceListId, req.params.id))

		const prices = {}
		items.forEach((item) => {
			prices[item.productId] = item.price
		})

		res.json({ ...priceList, prices })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// POST create price list
router.post('/', adminMiddleware, async (req, res) => {
	try {
		const { id, name, prices } = req.body

		// Insert price list
		const [newPriceList] = await db
			.insert(priceLists)
			.values({ id, name })
			.returning()

		// Insert price list items
		if (prices && typeof prices === 'object') {
			const itemsToInsert = Object.entries(prices).map(
				([productId, price]) => ({
					priceListId: id,
					productId: parseInt(productId),
					price: price,
				}),
			)

			if (itemsToInsert.length > 0) {
				await db.insert(priceListItems).values(itemsToInsert)
			}
		}

		const items = await db
			.select()
			.from(priceListItems)
			.where(eq(priceListItems.priceListId, id))

		const pricesObj = {}
		items.forEach((item) => {
			pricesObj[item.productId] = item.price
		})

		res.status(201).json({ ...newPriceList, prices: pricesObj })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// PUT update price list
router.put('/:id', adminMiddleware, async (req, res) => {
	try {
		const { name, prices } = req.body

		// Update price list name
		const [updatedPriceList] = await db
			.update(priceLists)
			.set({ name })
			.where(eq(priceLists.id, req.params.id))
			.returning()

		if (!updatedPriceList) {
			return res.status(404).json({ error: 'Price list not found' })
		}

		// Delete existing items and insert new ones
		if (prices && typeof prices === 'object') {
			await db
				.delete(priceListItems)
				.where(eq(priceListItems.priceListId, req.params.id))

			const itemsToInsert = Object.entries(prices).map(
				([productId, price]) => ({
					priceListId: req.params.id,
					productId: parseInt(productId),
					price: price,
				}),
			)

			if (itemsToInsert.length > 0) {
				await db.insert(priceListItems).values(itemsToInsert)
			}
		}

		const items = await db
			.select()
			.from(priceListItems)
			.where(eq(priceListItems.priceListId, req.params.id))

		const pricesObj = {}
		items.forEach((item) => {
			pricesObj[item.productId] = item.price
		})

		res.json({ ...updatedPriceList, prices: pricesObj })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// DELETE price list
router.delete('/:id', adminMiddleware, async (req, res) => {
	try {
		// Delete price list items first (foreign key constraint)
		await db
			.delete(priceListItems)
			.where(eq(priceListItems.priceListId, req.params.id))

		const [deletedPriceList] = await db
			.delete(priceLists)
			.where(eq(priceLists.id, req.params.id))
			.returning()

		if (!deletedPriceList) {
			return res.status(404).json({ error: 'Price list not found' })
		}

		res.json({ message: 'Price list deleted successfully' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

export default router
