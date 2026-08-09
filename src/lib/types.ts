export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  emoji: string;
};

export type CategoryWithCount = Category & { productCount: number };

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  imageUrl: string | null;
  rating: number;
  reviewsCount: number;
  featured: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductWithCategory = Product & { category: Category };

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderItem = {
  productId: string;
  name: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  createdAt: Date;
};

export type StoreSettings = {
  whatsappNumber: string;
  phoneNumber: string;
};

export type OrderWithCustomer = Order & { customer: Customer };
