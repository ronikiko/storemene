import { db } from '../src/db/index.js'
import {
	products,
	categories,
	priceLists,
	priceListItems,
	customers,
	settings,
} from '../src/db/schema.js'

console.log('Seeding database...')

// Seed Categories
const categoriesData = [
	{ id: 'new', name: 'מבצעים חמים', icon: 'flame' },
	{ id: 'drinks', name: 'משקאות', icon: 'coffee' },
	{ id: 'fruits_veg', name: 'פירות וירקות', icon: 'apple' },
	{ id: 'dairy', name: 'מוצרי חלב', icon: 'milk' },
	{ id: 'bakery', name: 'מאפייה', icon: 'croissant' },
	{ id: 'pantry', name: 'מזווה', icon: 'package' },
	{ id: 'cleaning', name: 'ניקיון', icon: 'sparkles' },
]

await db.insert(categories).values(categoriesData)
console.log(`✓ Seeded ${categoriesData.length} categories`)

// Seed Products
const productsData = [
	{
		title: 'שישיית מים מינרליים 1.5L',
		price: 12.9,
		originalPrice: 16.9,
		discount: 24,
		imageUrl:
			'https://images.unsplash.com/photo-1616118132534-381148898bb8?auto=format&fit=crop&w=600&q=80',
		rating: 4.9,
		reviews: 540,
		isNew: true,
		category: 'drinks',
	},
	{
		title: 'חלב טרי 3% בקרטון',
		price: 6.5,
		imageUrl:
			'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
		rating: 4.8,
		reviews: 320,
		isNew: false,
		category: 'dairy',
	},
	{
		title: 'מארז תפוחים אדומים (1 ק"ג)',
		price: 14.9,
		originalPrice: 19.9,
		discount: 25,
		imageUrl:
			'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=600&q=80',
		rating: 4.7,
		reviews: 150,
		isNew: false,
		category: 'fruits_veg',
	},
	{
		title: 'לחם מחמצת כפרי',
		price: 22.0,
		imageUrl:
			'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80',
		rating: 4.9,
		reviews: 85,
		isNew: true,
		category: 'bakery',
	},
	{
		title: 'קולה זירו 1.5L',
		price: 8.9,
		originalPrice: 10.9,
		discount: 18,
		imageUrl:
			'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600&q=80',
		rating: 4.8,
		reviews: 420,
		isNew: false,
		category: 'drinks',
	},
	{
		title: 'אבוקדו בשל (יחידה)',
		price: 6.9,
		imageUrl:
			'https://images.unsplash.com/photo-1523049673856-3eb43db958cd?auto=format&fit=crop&w=600&q=80',
		rating: 4.6,
		reviews: 98,
		isNew: false,
		category: 'fruits_veg',
	},
	{
		title: 'נוזל כלים בריח לימון',
		price: 11.9,
		originalPrice: 15.9,
		discount: 25,
		imageUrl:
			'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=600&q=80',
		rating: 4.5,
		reviews: 210,
		isNew: false,
		category: 'cleaning',
	},
	{
		title: 'פסטה פנה איטלקית',
		price: 7.9,
		imageUrl:
			'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&q=80',
		rating: 4.7,
		reviews: 180,
		isNew: false,
		category: 'pantry',
	},
	{
		title: "גבינת צ'דר פרוסה",
		price: 24.9,
		originalPrice: 29.9,
		discount: 17,
		imageUrl:
			'https://images.unsplash.com/photo-1618167297747-5026db1766cb?auto=format&fit=crop&w=600&q=80',
		rating: 4.8,
		reviews: 67,
		isNew: true,
		category: 'dairy',
	},
	{
		title: "חטיף צ'יפס טבעי",
		price: 5.9,
		imageUrl:
			'https://images.unsplash.com/photo-1621447504864-d8686e12698c?auto=format&fit=crop&w=600&q=80',
		rating: 4.4,
		reviews: 320,
		isNew: false,
		category: 'pantry',
	},
	{
		title: 'קרואסון חמאה טרי',
		price: 5.0,
		imageUrl:
			'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
		rating: 4.9,
		reviews: 150,
		isNew: false,
		category: 'bakery',
	},
	{
		title: "ג'ל כביסה מרוכז",
		price: 39.9,
		originalPrice: 55.0,
		discount: 27,
		imageUrl:
			'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
		rating: 4.8,
		reviews: 112,
		isNew: true,
		category: 'cleaning',
	},
]

const insertedProducts = await db
	.insert(products)
	.values(productsData)
	.returning()
console.log(`✓ Seeded ${insertedProducts.length} products`)

// Seed Price Lists
const priceListsData = [
	{ id: 'wholesale', name: 'סיטונאות' },
	{ id: 'vip', name: 'מועדון VIP' },
]

await db.insert(priceLists).values(priceListsData)
console.log(`✓ Seeded ${priceListsData.length} price lists`)

// Seed Price List Items
const priceListItemsData = [
	{ priceListId: 'wholesale', productId: insertedProducts[0].id, price: 9.9 },
	{ priceListId: 'wholesale', productId: insertedProducts[4].id, price: 6.9 },
	{ priceListId: 'wholesale', productId: insertedProducts[11].id, price: 29.9 },
	{ priceListId: 'vip', productId: insertedProducts[2].id, price: 11.9 },
	{ priceListId: 'vip', productId: insertedProducts[8].id, price: 19.9 },
]

await db.insert(priceListItems).values(priceListItemsData)
console.log(`✓ Seeded ${priceListItemsData.length} price list items`)

// Seed Customers
const customersData = [
	{
		id: 'c1',
		name: 'דני כהן (לקוח רגיל)',
		email: 'dani@gmail.com',
		phone: '050-1111111',
		priceListId: null,
		token: 'token_c1_secure_random_string',
	},
	{
		id: 'c2',
		name: 'מכולת יוסי (סיטונאות)',
		email: 'yossi@store.com',
		phone: '052-2222222',
		priceListId: 'wholesale',
		token: 'token_c2_secure_random_string',
	},
	{
		id: 'c3',
		name: 'שרה לוי (VIP)',
		email: 'sara@vip.com',
		phone: '054-3333333',
		priceListId: 'vip',
		token: 'token_c3_secure_random_string',
	},
]

await db.insert(customers).values(customersData)
console.log(`✓ Seeded ${customersData.length} customers`)

// Seed Settings
const settingsData = [{ id: 'show_prices', value: 'true' }]

await db.insert(settings).values(settingsData)
console.log(`✓ Seeded ${settingsData.length} settings`)

console.log('\n✅ Database seeded successfully!')
process.exit(0)
