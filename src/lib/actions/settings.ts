"use server";

import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

export async function updateStoreSettings(formData: FormData) {
  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").trim();
  const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();

  await db
    .collection("settings")
    .doc("store")
    .set({ whatsappNumber, phoneNumber }, { merge: true });

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}
