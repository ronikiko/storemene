-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    price REAL NOT NULL,
    originalPrice REAL,
    discount INTEGER,
    imageUrl TEXT NOT NULL,
    rating REAL NOT NULL DEFAULT 0,
    reviews INTEGER NOT NULL DEFAULT 0,
    isNew INTEGER NOT NULL DEFAULT 0,
    category TEXT NOT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    priceListId TEXT,
    token TEXT NOT NULL UNIQUE,
    FOREIGN KEY (priceListId) REFERENCES price_lists(id)
);

-- Price Lists table
CREATE TABLE IF NOT EXISTS price_lists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

-- Price List Items table (junction table for price list custom prices)
CREATE TABLE IF NOT EXISTS price_list_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    priceListId TEXT NOT NULL,
    productId INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (priceListId) REFERENCES price_lists(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(priceListId, productId)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_customers_token ON customers(token);
CREATE INDEX IF NOT EXISTS idx_price_list_items_priceListId ON price_list_items(priceListId);
CREATE INDEX IF NOT EXISTS idx_price_list_items_productId ON price_list_items(productId);
