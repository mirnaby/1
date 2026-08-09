"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, unstable_rethrow } from "next/navigation";
import { MapPin } from "lucide-react";
import { useCart, cartTotal } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { ProductVisual } from "@/components/store/ProductVisual";
import { MapPicker, type ResolvedLocation } from "@/components/store/MapPicker";
import { placeOrder } from "@/lib/actions/orders";

export function CheckoutForm() {
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<ResolvedLocation | null>(null);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.replace("/products");
    }
  }, [mounted, items.length, router]);

  if (!mounted || items.length === 0) return null;

  const itemsPayload = JSON.stringify(
    items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-3xl font-bold text-ink-900">
        إتمام الطلب
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <form
          action={async (formData) => {
            setError(null);
            setPending(true);
            try {
              await placeOrder(formData);
            } catch (err) {
              unstable_rethrow(err);
              setError(err instanceof Error ? err.message : "حدث خطأ ما");
            } finally {
              setPending(false);
            }
          }}
          className="space-y-5 rounded-2xl border border-brand-100 bg-white p-6"
        >
          <input type="hidden" name="items" value={itemsPayload} />
          <input type="hidden" name="lat" value={location?.lat ?? ""} />
          <input type="hidden" name="lng" value={location?.lng ?? ""} />
          <h2 className="font-heading text-lg font-bold text-ink-900">
            بيانات التوصيل
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">
                الاسم الكامل
              </label>
              <input
                required
                name="name"
                className="w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">
                رقم الهاتف (واتساب)
              </label>
              <input
                required
                type="tel"
                name="phone"
                dir="ltr"
                placeholder="07XX XXX XXXX"
                className="w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink-700">
              <MapPin className="h-4 w-4 text-brand-500" />
              موقع التوصيل على الخريطة (اختياري، يساعد المندوب على الوصول بسرعة)
            </label>
            <MapPicker onLocationChange={setLocation} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              تفاصيل العنوان (أقرب نقطة دالة، رقم البناية، الطابق)
            </label>
            <textarea
              required
              name="address"
              rows={3}
              placeholder="مثال: قرب جامع كذا، بناية 5، الطابق 2، شقة 3"
              className="w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {pending ? "جارٍ تنفيذ الطلب..." : "تأكيد الطلب"}
          </button>
        </form>

        <div className="h-fit rounded-2xl border border-brand-100 bg-white p-6">
          <h2 className="font-heading text-lg font-bold text-ink-900">
            ملخص الطلب
          </h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3">
                <ProductVisual
                  emoji={item.emoji}
                  gradientFrom={item.gradientFrom}
                  gradientTo={item.gradientTo}
                  imageUrl={item.imageUrl}
                  className="h-12 w-12 shrink-0 rounded-lg"
                  emojiClassName="text-lg"
                />
                <div className="flex-1 text-sm">
                  <p className="line-clamp-1 font-medium text-ink-900">
                    {item.name}
                  </p>
                  <p className="text-ink-500">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-brand-100 pt-4 font-heading text-base font-bold">
            <span>الإجمالي</span>
            <span className="text-brand-700">{formatPrice(cartTotal(items))}</span>
          </div>
          <Link
            href="/cart"
            className="mt-4 block text-center text-xs text-ink-500 hover:text-brand-600"
          >
            تعديل السلة
          </Link>
        </div>
      </div>
    </div>
  );
}
