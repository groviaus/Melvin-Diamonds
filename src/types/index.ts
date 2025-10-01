export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  mainImage: string;
  galleryImages: string[];
  ringSizes: string[];
  categories: string[];
  tags: string[];
  details: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  id: string;
  name: string;
  subcategories: Subcategory[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryData {
  categories: Category[];
}

// Auth & User Types
export interface User {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  provider?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  isDefault: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemDB {
  id: string;
  userId: string;
  productId: string;
  title: string;
  price: number;
  image?: string;
  size?: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;

  // Customer Info
  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  // Shipping Address
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddress: string;
  shippingApartment?: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;

  // Billing Address
  billingSameAsShipping: boolean;
  billingFirstName?: string;
  billingLastName?: string;
  billingAddress?: string;
  billingApartment?: string;
  billingCity?: string;
  billingState?: string;
  billingZipCode?: string;
  billingCountry?: string;

  // Order Details
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;

  // Payment
  paymentMethod: string; // 'cod', 'razorpay', 'upi'
  paymentStatus: string; // 'pending', 'paid', 'failed', 'refunded'
  transactionId?: string; // Razorpay payment_id
  razorpayOrderId?: string; // Razorpay order_id
  razorpaySignature?: string; // Payment verification signature
  paymentDetails?: Record<string, unknown>; // Complete Razorpay response

  // Status
  status: string;
  notes?: string;

  createdAt: string;
  updatedAt: string;

  // Relations
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  productImage?: string;
  size?: string;
  quantity: number;
  price: number;
  subtotal: number;
  createdAt: string;
}
