import {
	pgTable,
	serial,
	text,
	real,
	integer,
	boolean,
	varchar,
	timestamp,
} from 'drizzle-orm/pg-core'

// Products table
export const products = pgTable('products', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	price: real('price').notNull(),
	originalPrice: real('original_price'),
	discount: integer('discount'),
	imageUrl: text('image_url').notNull(),
	rating: real('rating').notNull().default(0),
	reviews: integer('reviews').notNull().default(0),
	isNew: boolean('is_new').notNull().default(false),
	category: text('category').notNull(),
})

// Categories table
export const categories = pgTable('categories', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	icon: text('icon').notNull(),
})

// Customers table
export const customers = pgTable('customers', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	phone: text('phone').notNull(),
	priceListId: text('price_list_id'),
	token: text('token').notNull().unique(),
})

// Price Lists table
export const priceLists = pgTable('price_lists', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
})

// Price List Items table (junction table)
export const priceListItems = pgTable('price_list_items', {
	id: serial('id').primaryKey(),
	priceListId: text('price_list_id').notNull(),
	productId: integer('product_id').notNull(),
	price: real('price').notNull(),
})

// Settings table
export const settings = pgTable('settings', {
	id: text('id').primaryKey(),
	value: text('value').notNull(),
})

// Orders table
export const orders = pgTable('orders', {
	id: text('id').primaryKey(), // Using ORD-XXXX format as in frontend
	customerId: text('customer_id'),
	customerName: text('customer_name').notNull(),
	customerPhone: text('customer_phone'),
	customerAddress: text('customer_address'),
	totalAmount: real('total_amount').notNull(),
	discountPercent: real('discount_percent').notNull().default(0),
	status: text('status').notNull().default('pending'),
	documentLink: text('document_link'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Order Items table
export const orderItems = pgTable('order_items', {
	id: serial('id').primaryKey(),
	orderId: text('order_id').notNull(),
	productId: integer('product_id').notNull(),
	title: text('title').notNull(),
	quantity: integer('quantity').notNull(),
	price: real('price').notNull(),
	discountPercent: real('discount_percent').notNull().default(0),
	total: real('total').notNull(),
	imageUrl: text('image_url').notNull(),
})
