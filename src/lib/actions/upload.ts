"use server";

export async function uploadProductImage(formData: FormData): Promise<string> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("الرجاء اختيار صورة");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("الملف المختار ليس صورة");
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

  const uploadForm = new FormData();
  uploadForm.append("image", base64);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
    { method: "POST", body: uploadForm }
  );

  const data = await res.json();
  if (!res.ok || !data?.data?.url) {
    throw new Error(data?.error?.message || "فشل رفع الصورة، حاولي مرة أخرى");
  }

  return data.data.url as string;
}
