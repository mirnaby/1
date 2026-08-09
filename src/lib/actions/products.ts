"use server";

import { db, Timestamp } from "@/lib/firebase";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function slugify(name: string) {
  const base = name
    .trim()
    .replace(/[^؀-ۿa-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
  return `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function readProductForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: Number(formData.get("price") ?? 0),
    compareAtPrice: formData.get("compareAtPrice")
      ? Number(formData.get("compareAtPrice"))
      : null,
    stock: Number(formData.get("stock") ?? 0),
    categoryId: String(formData.get("categoryId") ?? ""),
    emoji: String(formData.get("emoji") ?? "💄").trim() || "💄",
    gradientFrom: String(formData.get("gradientFrom") ?? "#f9d5e5"),
    gradientTo: String(formData.get("gradientTo") ?? "#f7a1c4"),
    imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
    featured: formData.get("featured") === "on",
  };
}

export async function createProduct(formData: FormData) {
  const data = readProductForm(formData);
  if (!data.name || !data.categoryId) {
    throw new Error("الرجاء تعبئة اسم المنتج والفئة");
  }

  const now = Timestamp.now();
  await db.collection("products").add({
    ...data,
    slug: slugify(data.name),
    rating: 4.5,
    reviewsCount: 0,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(productId: string, formData: FormData) {
  const data = readProductForm(formData);
  if (!data.name || !data.categoryId) {
    throw new Error("الرجاء تعبئة اسم المنتج والفئة");
  }

  await db
    .collection("products")
    .doc(productId)
    .update({ ...data, updatedAt: Timestamp.now() });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  if (!productId) return;

  const ordersSnap = await db.collection("orders").get();
  const hasOrders = ordersSnap.docs.some((doc) => {
    const items = (doc.data().items ?? []) as { productId: string }[];
    return items.some((item) => item.productId === productId);
  });

  if (hasOrders) {
    throw new Error(
      "لا يمكن حذف منتج له طلبات سابقة، يمكنكِ تعديل الكمية إلى صفر بدلاً من ذلك"
    );
  }

  await db.collection("products").doc(productId).delete();

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}
