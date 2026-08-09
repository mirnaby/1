"use server";

import { db, Timestamp } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/lib/types";
import { getProductById } from "@/lib/data";

function normalizePhone(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits.startsWith("0") ? digits.slice(1) : digits;
}

export async function placeOrder(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const latRaw = formData.get("lat") ? Number(formData.get("lat")) : null;
  const lngRaw = formData.get("lng") ? Number(formData.get("lng")) : null;
  const lat = latRaw !== null && !Number.isNaN(latRaw) ? latRaw : null;
  const lng = lngRaw !== null && !Number.isNaN(lngRaw) ? lngRaw : null;
  const itemsJson = String(formData.get("items") ?? "[]");

  if (!name || !phoneRaw || !address) {
    throw new Error("الرجاء تعبئة البيانات المطلوبة");
  }

  const phone = normalizePhone(phoneRaw);

  const requestedItems: { productId: string; quantity: number }[] = JSON.parse(itemsJson);
  if (requestedItems.length === 0) throw new Error("السلة فارغة");

  const orderItemsData = [];
  let total = 0;

  for (const { productId, quantity } of requestedItems) {
    const product = await getProductById(productId);
    if (!product) throw new Error("منتج غير موجود");
    orderItemsData.push({
      productId: product.id,
      name: product.name,
      emoji: product.emoji,
      gradientFrom: product.gradientFrom,
      gradientTo: product.gradientTo,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity,
    });
    total += product.price * quantity;
  }

  const now = Timestamp.now();
  const customerRef = db.collection("customers").doc(phone);
  const existingCustomer = await customerRef.get();
  await customerRef.set(
    {
      name,
      phone,
      address,
      lat,
      lng,
      createdAt: existingCustomer.exists ? existingCustomer.data()!.createdAt : now,
    },
    { merge: true }
  );

  const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
  await db.collection("orders").add({
    orderNumber,
    customerId: phone,
    status: "PENDING",
    total: Math.round(total * 100) / 100,
    items: orderItemsData,
    createdAt: now,
    updatedAt: now,
  });

  await Promise.all(
    orderItemsData.map((item) =>
      db
        .collection("products")
        .doc(item.productId)
        .update({ stock: FieldValue.increment(-item.quantity) })
    )
  );

  revalidatePath("/admin");
  redirect(`/order-confirmation/${orderNumber}`);
}

export async function updateOrderStatus(orderId: string, formData: FormData) {
  const status = String(formData.get("status") ?? "") as OrderStatus;
  const validStatuses: OrderStatus[] = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];
  if (!validStatuses.includes(status)) {
    throw new Error("حالة غير صالحة");
  }

  await db
    .collection("orders")
    .doc(orderId)
    .update({ status, updatedAt: Timestamp.now() });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
}
