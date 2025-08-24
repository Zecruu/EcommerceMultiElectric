export interface User {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'customer' | 'employee' | 'admin';
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  _id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  images: string[];
  categoryIds: string[];
  specifications?: Record<string, string>;
  hot: boolean;
  active: boolean;
  featured: boolean;
  brand?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku: string;
}

export interface Cart {
  _id?: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    sku: string;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'Pending' | 'Paid' | 'Preparing' | 'Ready' | 'PickedUp' | 'Refunded' | 'Cancelled';
  payment: {
    provider: 'stripe';
    intentId: string;
    status: string;
    method?: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  pickup: {
    code: string;
    instructions?: string;
    readyAt?: Date;
    pickedUpAt?: Date;
    pickedUpBy?: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  _id: string;
  actorId: string;
  actorName: string;
  action: string;
  targetType: 'product' | 'order' | 'user' | 'inventory' | 'system';
  targetId: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  ip: string;
  userAgent?: string;
  createdAt: Date;
}

export interface InventoryUpdate {
  _id: string;
  productId: string;
  actorId: string;
  type: 'adjustment' | 'sale' | 'restock' | 'damage' | 'sync';
  quantityBefore: number;
  quantityAfter: number;
  reason: string;
  notes?: string;
  createdAt: Date;
}

export interface Promotion {
  _id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'bogo' | 'free_shipping';
  value: number;
  code?: string;
  description: string;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  startDate: Date;
  endDate: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
