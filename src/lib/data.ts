import { db } from "@/lib/firebase";
import type {
  Category,
  CategoryWithCount,
  Customer,
  Order,
  OrderWithCustomer,
  Product,
  ProductWithCategory,
  StoreSettings,
} from "@/lib/types";

function toDate(value: unknown): Date {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate();
  }
  return value instanceof Date ? value : new Date();
}

function docToCategory(doc: FirebaseFirestore.QueryDocumentSnapshot): Category {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    slug: data.slug,
    description: data.description ?? null,
    emoji: data.emoji ?? "✨",
  };
}

function docToProduct(doc: FirebaseFirestore.QueryDocumentSnapshot): Product {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    price: data.price,
    compareAtPrice: data.compareAtPrice ?? null,
    stock: data.stock,
    emoji: data.emoji,
    gradientFrom: data.gradientFrom,
    gradientTo: data.gradientTo,
    imageUrl: data.imageUrl ?? null,
    rating: data.rating,
    reviewsCount: data.reviewsCount,
    featured: data.featured,
    categoryId: data.categoryId,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function getAllCategories(): Promise<Category[]> {
  const snap = await db.collection("categories").orderBy("name", "asc").get();
  return snap.docs.map(docToCategory);
}

export async function getCategories(): Promise<CategoryWithCount[]> {
  const [categories, products] = await Promise.all([
    getAllCategories(),
    db.collection("products").get(),
  ]);

  const counts = new Map<string, number>();
  for (const doc of products.docs) {
    const categoryId = doc.data().categoryId as string;
    counts.set(categoryId, (counts.get(categoryId) ?? 0) + 1);
  }

  return categories.map((c) => ({ ...c, productCount: counts.get(c.id) ?? 0 }));
}

async function attachCategories(products: Product[]): Promise<ProductWithCategory[]> {
  const categories = await getAllCategories();
  const byId = new Map(categories.map((c) => [c.id, c]));
  return products
    .filter((p) => byId.has(p.categoryId))
    .map((p) => ({ ...p, category: byId.get(p.categoryId)! }));
}

async function getAllProducts(): Promise<Product[]> {
  const snap = await db.collection("products").get();
  return snap.docs.map(docToProduct);
}

export async function getFeaturedProducts(take = 4): Promise<ProductWithCategory[]> {
  const products = await getAllProducts();
  const withCategory = await attachCategories(products);
  return withCategory
    .filter((p) => p.featured)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, take);
}

export async function getProducts({
  categorySlug,
  search,
  sort,
}: {
  categorySlug?: string;
  search?: string;
  sort?: string;
}): Promise<ProductWithCategory[]> {
  const products = await getAllProducts();
  let withCategory = await attachCategories(products);

  if (categorySlug) {
    withCategory = withCategory.filter((p) => p.category.slug === categorySlug);
  }
  if (search) {
    const q = search.trim().toLowerCase();
    withCategory = withCategory.filter((p) => p.name.toLowerCase().includes(q));
  }

  withCategory.sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return withCategory;
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  const snap = await db.collection("products").where("slug", "==", slug).limit(1).get();
  if (snap.empty) return null;
  const product = docToProduct(snap.docs[0]);
  const [withCategory] = await attachCategories([product]);
  return withCategory ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const doc = await db.collection("products").doc(id).get();
  if (!doc.exists) return null;
  return docToProduct(doc as FirebaseFirestore.QueryDocumentSnapshot);
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string
): Promise<ProductWithCategory[]> {
  const products = await getAllProducts();
  const filtered = products.filter((p) => p.categoryId === categoryId && p.id !== excludeId).slice(0, 4);
  return attachCategories(filtered);
}

function docToOrder(doc: FirebaseFirestore.QueryDocumentSnapshot): Order {
  const data = doc.data();
  return {
    id: doc.id,
    orderNumber: data.orderNumber,
    customerId: data.customerId,
    status: data.status,
    total: data.total,
    items: data.items ?? [],
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

function docToCustomer(doc: FirebaseFirestore.QueryDocumentSnapshot): Customer {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    phone: data.phone ?? doc.id,
    address: data.address ?? null,
    lat: data.lat ?? null,
    lng: data.lng ?? null,
    createdAt: toDate(data.createdAt),
  };
}

export async function getAllCustomers(): Promise<Customer[]> {
  const snap = await db.collection("customers").orderBy("createdAt", "desc").get();
  return snap.docs.map(docToCustomer);
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const doc = await db.collection("customers").doc(id).get();
  if (!doc.exists) return null;
  return docToCustomer(doc as FirebaseFirestore.QueryDocumentSnapshot);
}

export async function getAllOrders(): Promise<Order[]> {
  const snap = await db.collection("orders").orderBy("createdAt", "desc").get();
  return snap.docs.map(docToOrder);
}

export async function getOrdersWithCustomers(): Promise<OrderWithCustomer[]> {
  const [orders, customers] = await Promise.all([getAllOrders(), getAllCustomers()]);
  const byId = new Map(customers.map((c) => [c.id, c]));
  return orders
    .filter((o) => byId.has(o.customerId))
    .map((o) => ({ ...o, customer: byId.get(o.customerId)! }));
}

export async function getOrderById(id: string): Promise<OrderWithCustomer | null> {
  const doc = await db.collection("orders").doc(id).get();
  if (!doc.exists) return null;
  const order = docToOrder(doc as FirebaseFirestore.QueryDocumentSnapshot);
  const customer = await getCustomerById(order.customerId);
  if (!customer) return null;
  return { ...order, customer };
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const snap = await db
    .collection("orders")
    .where("orderNumber", "==", orderNumber)
    .limit(1)
    .get();
  if (snap.empty) return null;
  return docToOrder(snap.docs[0]);
}

export async function getOrdersByCustomerId(customerId: string): Promise<Order[]> {
  const orders = await getAllOrders();
  return orders.filter((o) => o.customerId === customerId);
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const doc = await db.collection("settings").doc("store").get();
  const data = doc.data() ?? {};
  return {
    whatsappNumber: data.whatsappNumber ?? "",
    phoneNumber: data.phoneNumber ?? "",
  };
}
