import { pgTable, serial, text, real, integer, boolean, varchar } from 'drizzle-orm/pg-core';

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
});

// Categories table
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
});

// Customers table
export const customers = pgTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  priceListId: text('price_list_id'),
  token: text('token').notNull().unique(),
});

// Price Lists table
export const priceLists = pgTable('price_lists', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

// Price List Items table (junction table)
export const priceListItems = pgTable('price_list_items', {
  id: serial('id').primaryKey(),
  priceListId: text('price_list_id').notNull(),
  productId: integer('product_id').notNull(),
  price: real('price').notNull(),
});

// Settings table
export const settings = pgTable('settings', {
  id: text('id').primaryKey(),
  value: text('value').notNull(),
});
