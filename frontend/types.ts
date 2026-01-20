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
  icon: string;
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

export type OrderStatus = 'pending' | 'processing' | 'ready_for_shipping' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: number;
  title: string;
  quantity: number;
  price: number;
  total: number;
  imageUrl: string;
  discountPercent: number;
  pickingStatus?: 'pending' | 'collected' | 'out_of_stock';
  pickedQuantity?: number;
}

export interface Order {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  items: OrderItem[];
  totalAmount: number;
  discountPercent: number;
  status: OrderStatus;
  documentLink?: string;
  pickingToken?: string;
  whatsAppLink?: string;
  createdAt: string;
}