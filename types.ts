export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface PriceList {
  id: string;
  name: string;
  prices: Record<number, number>; // productId -> customPrice
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  priceListId?: string; // Optional link to a price list
  token: string;
}