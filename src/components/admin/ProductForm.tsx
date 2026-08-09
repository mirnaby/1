"use client";

import { useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import { ProductVisual } from "@/components/store/ProductVisual";
import { uploadProductImage } from "@/lib/actions/upload";

type Category = { id: string; name: string; emoji: string };

type ProductDefaults = {
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  categoryId: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  imageUrl: string | null;
  featured: boolean;
};

const emojiOptions = [
  "💄", "✨", "💧", "🌿", "🌹", "🎨", "💋", "🌟", "🖤", "🌷",
  "🪞", "🧴", "🍯", "🛀", "🤲", "☀️", "👑", "🤍", "🍦",
];

export function ProductForm({
  action,
  categories,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  defaults?: Partial<ProductDefaults>;
  submitLabel: string;
}) {
  const [emoji, setEmoji] = useState(defaults?.emoji ?? "💄");
  const [gradientFrom, setGradientFrom] = useState(defaults?.gradientFrom ?? "#f9d5e5");
  const [gradientTo, setGradientTo] = useState(defaults?.gradientTo ?? "#f7a1c4");
  const [imageUrl, setImageUrl] = useState<string | null>(defaults?.imageUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const url = await uploadProductImage(fd);
      setImageUrl(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          try {
            await action(formData);
          } catch (err) {
            unstable_rethrow(err);
            setError(err instanceof Error ? err.message : "حدث خطأ ما");
          }
        });
      }}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]"
    >
      <div className="space-y-5 rounded-2xl border border-brand-100 bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700">
            اسم المنتج
          </label>
          <input
            required
            name="name"
            defaultValue={defaults?.name}
            className="w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700">
            الوصف
          </label>
          <textarea
            required
            name="description"
            rows={4}
            defaultValue={defaults?.description}
            className="w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              السعر (د.ع)
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              name="price"
              defaultValue={defaults?.price}
              className="w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              السعر قبل الخصم
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="compareAtPrice"
              defaultValue={defaults?.compareAtPrice ?? undefined}
              className="w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              الكمية بالمخزون
            </label>
            <input
              required
              type="number"
              min="0"
              name="stock"
              defaultValue={defaults?.stock}
              className="w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700">
            الفئة
          </label>
          <select
            required
            name="categoryId"
            defaultValue={defaults?.categoryId}
            className="w-full rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="" disabled>
              اختاري الفئة
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={defaults?.featured}
            className="h-4 w-4 rounded border-brand-300 text-brand-600 focus:ring-brand-400"
          />
          منتج مميز (يظهر في الصفحة الرئيسية)
        </label>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {isPending ? "جارٍ الحفظ..." : submitLabel}
        </button>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-brand-100 bg-white p-6">
          <p className="mb-3 text-sm font-semibold text-ink-900">معاينة الصورة</p>
          <ProductVisual
            emoji={emoji}
            gradientFrom={gradientFrom}
            gradientTo={gradientTo}
            imageUrl={imageUrl}
            className="aspect-square w-full rounded-2xl"
            emojiClassName="text-6xl"
          />

          <input type="hidden" name="emoji" value={emoji} />
          <input type="hidden" name="gradientFrom" value={gradientFrom} />
          <input type="hidden" name="gradientTo" value={gradientTo} />
          <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />

          <p className="mb-2 mt-4 text-xs font-medium text-ink-700">صورة المنتج</p>
          <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-brand-300 bg-brand-50 px-4 py-2.5 text-xs font-semibold text-brand-700 hover:bg-brand-100">
            {uploading ? "جارٍ الرفع..." : imageUrl ? "استبدال الصورة" : "رفع صورة"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {imageUrl && (
            <button
              type="button"
              onClick={() => setImageUrl(null)}
              className="mt-2 w-full text-center text-xs font-medium text-ink-500 hover:text-red-600"
            >
              إزالة الصورة والعودة للرمز التعبيري
            </button>
          )}
          {uploadError && (
            <p className="mt-2 text-xs text-red-600">{uploadError}</p>
          )}

          <p className="mb-2 mt-4 text-xs font-medium text-ink-700">
            الرمز التعبيري {imageUrl && "(احتياطي إن أُزيلت الصورة)"}
          </p>
          <div className="grid grid-cols-6 gap-1.5">
            {emojiOptions.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`flex h-8 items-center justify-center rounded-lg text-base ${
                  emoji === e ? "bg-brand-100 ring-2 ring-brand-400" : "bg-brand-50"
                }`}
              >
                {e}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-700">
                لون البداية
              </label>
              <input
                type="color"
                value={gradientFrom}
                onChange={(e) => setGradientFrom(e.target.value)}
                className="h-9 w-full cursor-pointer rounded-lg border border-brand-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-700">
                لون النهاية
              </label>
              <input
                type="color"
                value={gradientTo}
                onChange={(e) => setGradientTo(e.target.value)}
                className="h-9 w-full cursor-pointer rounded-lg border border-brand-200"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
