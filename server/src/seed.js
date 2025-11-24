import db from './db.js';

console.log('Seeding database...');

// Clear existing data
db.prepare('DELETE FROM price_list_items').run();
db.prepare('DELETE FROM customers').run();
db.prepare('DELETE FROM price_lists').run();
db.prepare('DELETE FROM products').run();
db.prepare('DELETE FROM categories').run();

// Seed Categories
const categories = [
  { id: 'new', name: 'מבצעים חמים', icon: 'flame' },
  { id: 'drinks', name: 'משקאות', icon: 'coffee' },
  { id: 'fruits_veg', name: 'פירות וירקות', icon: 'apple' },
  { id: 'dairy', name: 'מוצרי חלב', icon: 'milk' },
  { id: 'bakery', name: 'מאפייה', icon: 'croissant' },
  { id: 'pantry', name: 'מזווה', icon: 'package' },
  { id: 'cleaning', name: 'ניקיון', icon: 'sparkles' },
];

const categoryStmt = db.prepare('INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)');
categories.forEach(cat => {
  categoryStmt.run(cat.id, cat.name, cat.icon);
});
console.log(`✓ Seeded ${categories.length} categories`);

// Seed Products
const products = [
  {
    title: "שישיית מים מינרליים 1.5L",
    price: 12.90,
    originalPrice: 16.90,
    discount: 24,
    imageUrl: "https://images.unsplash.com/photo-1616118132534-381148898bb8?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviews: 540,
    isNew: 1,
    category: "drinks"
  },
  {
    title: "חלב טרי 3% בקרטון",
    price: 6.50,
    imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviews: 320,
    isNew: 0,
    category: "dairy"
  },
  {
    title: "מארז תפוחים אדומים (1 ק\"ג)",
    price: 14.90,
    originalPrice: 19.90,
    discount: 25,
    imageUrl: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviews: 150,
    isNew: 0,
    category: "fruits_veg"
  },
  {
    title: "לחם מחמצת כפרי",
    price: 22.00,
    imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviews: 85,
    isNew: 1,
    category: "bakery"
  },
  {
    title: "קולה זירו 1.5L",
    price: 8.90,
    originalPrice: 10.90,
    discount: 18,
    imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviews: 420,
    isNew: 0,
    category: "drinks"
  },
  {
    title: "אבוקדו בשל (יחידה)",
    price: 6.90,
    imageUrl: "https://images.unsplash.com/photo-1523049673856-3eb43db958cd?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    reviews: 98,
    isNew: 0,
    category: "fruits_veg"
  },
  {
    title: "נוזל כלים בריח לימון",
    price: 11.90,
    originalPrice: 15.90,
    discount: 25,
    imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=600&q=80",
    rating: 4.5,
    reviews: 210,
    isNew: 0,
    category: "cleaning"
  },
  {
    title: "פסטה פנה איטלקית",
    price: 7.90,
    imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviews: 180,
    isNew: 0,
    category: "pantry"
  },
  {
    title: "גבינת צ'דר פרוסה",
    price: 24.90,
    originalPrice: 29.90,
    discount: 17,
    imageUrl: "https://images.unsplash.com/photo-1618167297747-5026db1766cb?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviews: 67,
    isNew: 1,
    category: "dairy"
  },
  {
    title: "חטיף צ'יפס טבעי",
    price: 5.90,
    imageUrl: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?auto=format&fit=crop&w=600&q=80",
    rating: 4.4,
    reviews: 320,
    isNew: 0,
    category: "pantry"
  },
  {
    title: "קרואסון חמאה טרי",
    price: 5.00,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviews: 150,
    isNew: 0,
    category: "bakery"
  },
  {
    title: "ג'ל כביסה מרוכז",
    price: 39.90,
    originalPrice: 55.00,
    discount: 27,
    imageUrl: "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviews: 112,
    isNew: 1,
    category: "cleaning"
  }
];

const productStmt = db.prepare(`
  INSERT INTO products (title, price, originalPrice, discount, imageUrl, rating, reviews, isNew, category)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

products.forEach(p => {
  productStmt.run(
    p.title,
    p.price,
    p.originalPrice || null,
    p.discount || null,
    p.imageUrl,
    p.rating,
    p.reviews,
    p.isNew,
    p.category
  );
});
console.log(`✓ Seeded ${products.length} products`);

// Seed Price Lists
const priceLists = [
  { id: 'wholesale', name: 'סיטונאות' },
  { id: 'vip', name: 'מועדון VIP' }
];

const priceListStmt = db.prepare('INSERT INTO price_lists (id, name) VALUES (?, ?)');
priceLists.forEach(pl => {
  priceListStmt.run(pl.id, pl.name);
});
console.log(`✓ Seeded ${priceLists.length} price lists`);

// Seed Price List Items
const priceListItems = [
  { priceListId: 'wholesale', productId: 1, price: 9.90 },
  { priceListId: 'wholesale', productId: 5, price: 6.90 },
  { priceListId: 'wholesale', productId: 12, price: 29.90 },
  { priceListId: 'vip', productId: 3, price: 11.90 },
  { priceListId: 'vip', productId: 9, price: 19.90 },
];

const priceListItemStmt = db.prepare('INSERT INTO price_list_items (priceListId, productId, price) VALUES (?, ?, ?)');
priceListItems.forEach(item => {
  priceListItemStmt.run(item.priceListId, item.productId, item.price);
});
console.log(`✓ Seeded ${priceListItems.length} price list items`);

// Seed Customers
const customers = [
  {
    id: 'c1',
    name: 'דני כהן (לקוח רגיל)',
    email: 'dani@gmail.com',
    phone: '050-1111111',
    priceListId: null,
    token: 'token_c1_secure_random_string'
  },
  {
    id: 'c2',
    name: 'מכולת יוסי (סיטונאות)',
    email: 'yossi@store.com',
    phone: '052-2222222',
    priceListId: 'wholesale',
    token: 'token_c2_secure_random_string'
  },
  {
    id: 'c3',
    name: 'שרה לוי (VIP)',
    email: 'sara@vip.com',
    phone: '054-3333333',
    priceListId: 'vip',
    token: 'token_c3_secure_random_string'
  }
];

const customerStmt = db.prepare(`
  INSERT INTO customers (id, name, email, phone, priceListId, token)
  VALUES (?, ?, ?, ?, ?, ?)
`);

customers.forEach(c => {
  customerStmt.run(c.id, c.name, c.email, c.phone, c.priceListId, c.token);
});
console.log(`✓ Seeded ${customers.length} customers`);

console.log('\n✅ Database seeded successfully!');
process.exit(0);
