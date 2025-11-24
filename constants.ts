import { Product, Category, Customer, PriceList } from './types';

export const CATEGORIES: Category[] = [
  { id: 'new', name: 'מבצעים חמים', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=150&q=80' },
  { id: 'drinks', name: 'משקאות', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=150&q=80' },
  { id: 'fruits_veg', name: 'פירות וירקות', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=150&q=80' },
  { id: 'dairy', name: 'מוצרי חלב', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=150&q=80' },
  { id: 'bakery', name: 'מאפייה', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&q=80' },
  { id: 'pantry', name: 'מזווה', image: 'https://images.unsplash.com/photo-1584263347416-85a696b4eda7?auto=format&fit=crop&w=150&q=80' },
  { id: 'cleaning', name: 'ניקיון', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=150&q=80' },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: "שישיית מים מינרליים 1.5L",
    price: 12.90,
    originalPrice: 16.90,
    discount: 24,
    imageUrl: "https://images.unsplash.com/photo-1616118132534-381148898bb8?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviews: 540,
    isNew: true,
    category: "drinks"
  },
  {
    id: 2,
    title: "חלב טרי 3% בקרטון",
    price: 6.50,
    imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviews: 320,
    category: "dairy"
  },
  {
    id: 3,
    title: "מארז תפוחים אדומים (1 ק\"ג)",
    price: 14.90,
    originalPrice: 19.90,
    discount: 25,
    imageUrl: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviews: 150,
    category: "fruits_veg"
  },
  {
    id: 4,
    title: "לחם מחמצת כפרי",
    price: 22.00,
    imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviews: 85,
    isNew: true,
    category: "bakery"
  },
  {
    id: 5,
    title: "קולה זירו 1.5L",
    price: 8.90,
    originalPrice: 10.90,
    discount: 18,
    imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviews: 420,
    category: "drinks"
  },
  {
    id: 6,
    title: "אבוקדו בשל (יחידה)",
    price: 6.90,
    imageUrl: "https://images.unsplash.com/photo-1523049673856-3eb43db958cd?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    reviews: 98,
    category: "fruits_veg"
  },
  {
    id: 7,
    title: "נוזל כלים בריח לימון",
    price: 11.90,
    originalPrice: 15.90,
    discount: 25,
    imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=600&q=80",
    rating: 4.5,
    reviews: 210,
    category: "cleaning"
  },
  {
    id: 8,
    title: "פסטה פנה איטלקית",
    price: 7.90,
    imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviews: 180,
    category: "pantry"
  },
  {
    id: 9,
    title: "גבינת צ'דר פרוסה",
    price: 24.90,
    originalPrice: 29.90,
    discount: 17,
    imageUrl: "https://images.unsplash.com/photo-1618167297747-5026db1766cb?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviews: 67,
    isNew: true,
    category: "dairy"
  },
  {
    id: 10,
    title: "חטיף צ'יפס טבעי",
    price: 5.90,
    imageUrl: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?auto=format&fit=crop&w=600&q=80",
    rating: 4.4,
    reviews: 320,
    category: "pantry"
  },
  {
    id: 11,
    title: "קרואסון חמאה טרי",
    price: 5.00,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviews: 150,
    category: "bakery"
  },
  {
    id: 12,
    title: "ג'ל כביסה מרוכז",
    price: 39.90,
    originalPrice: 55.00,
    discount: 27,
    imageUrl: "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviews: 112,
    isNew: true,
    category: "cleaning"
  }
];

export const PRICE_LISTS: PriceList[] = [
  {
    id: 'wholesale',
    name: 'סיטונאות',
    prices: {
      1: 9.90, // Discounted Water
      5: 6.90, // Discounted Coke
      12: 29.90 // Discounted Gel
    }
  },
  {
    id: 'vip',
    name: 'מועדון VIP',
    prices: {
      3: 11.90, // Apples
      9: 19.90, // Cheese
    }
  }
];

export const CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'דני כהן (לקוח רגיל)',
    email: 'dani@gmail.com',
    phone: '050-1111111',
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