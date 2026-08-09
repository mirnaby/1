"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart, cartTotal } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { ProductVisual } from "@/components/store/ProductVisual";

export default function CartPage() {
  const { items, removeItem, setQuantity } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center">
        <ShoppingBag className="h-16 w-16 text-brand-200" />
        <h1 className="font-heading text-2xl font-bold text-ink-900">
          سلتك فارغة
        </h1>
        <p className="text-ink-500">أضيفي منتجات لتظهر هنا</p>
        <Link
          href="/products"
          className="rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          تصفحي المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-3xl font-bold text-ink-900">
        سلة التسوق
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-white p-4"
            >
              <ProductVisual
                emoji={item.emoji}
                gradientFrom={item.gradientFrom}
                gradientTo={item.gradientTo}
                imageUrl={item.imageUrl}
                className="h-20 w-20 shrink-0 rounded-xl"
                emojiClassName="text-3xl"
              />
              <div className="flex flex-1 flex-col gap-1">
                <Link
                  href={`/products/${item.slug}`}
                  className="font-heading text-sm font-bold text-ink-900 hover:text-brand-700"
                >
                  {item.name}
                </Link>
                <span className="text-sm font-bold text-brand-700">
                  {formatPrice(item.price)}
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-200 hover:bg-brand-50"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-200 hover:bg-brand-50 disabled:opacity-40"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-ink-500 hover:text-brand-600"
                  aria-label="إزالة"
                >
                  <X className="h-5 w-5" />
                </button>
                <span className="font-heading text-sm font-bold text-ink-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-2xl border border-brand-100 bg-white p-6">
          <h2 className="font-heading text-lg font-bold text-ink-900">
            ملخص الطلب
          </h2>
          <div className="mt-4 flex items-center justify-between text-sm text-ink-700">
            <span>الإجمالي الفرعي</span>
            <span>{formatPrice(cartTotal(items))}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-ink-700">
            <span>الشحن</span>
            <span className="text-emerald-600">مجاني</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-brand-100 pt-4 font-heading text-base font-bold text-ink-900">
            <span>الإجمالي</span>
            <span className="text-brand-700">{formatPrice(cartTotal(items))}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            متابعة الدفع
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
