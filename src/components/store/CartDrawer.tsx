"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart, cartTotal } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { ProductVisual } from "./ProductVisual";

export function CartDrawer() {
  const { items, isOpen, close, removeItem, setQuantity } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-50 bg-ink-900/40 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col bg-cream-50 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-brand-100 px-5 py-4">
          <h2 className="font-heading text-lg font-bold text-ink-900">
            سلة التسوق
          </h2>
          <button
            onClick={close}
            className="rounded-full p-1.5 text-ink-500 hover:bg-brand-50"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-brand-200" />
            <p className="text-ink-500">سلتك فارغة حالياً</p>
            <button
              onClick={close}
              className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              تابعي التسوق
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-3">
                    <ProductVisual
                      emoji={item.emoji}
                      gradientFrom={item.gradientFrom}
                      gradientTo={item.gradientTo}
                      imageUrl={item.imageUrl}
                      className="h-16 w-16 shrink-0 rounded-xl"
                      emojiClassName="text-2xl"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-semibold text-ink-900">
                          {item.name}
                        </span>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-ink-500 hover:text-brand-600"
                          aria-label="إزالة"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-brand-700">
                        {formatPrice(item.price)}
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          onClick={() =>
                            setQuantity(item.productId, item.quantity - 1)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200 text-ink-700 hover:bg-brand-50"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            setQuantity(item.productId, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200 text-ink-700 hover:bg-brand-50 disabled:opacity-40"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-brand-100 px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-sm font-medium text-ink-700">
                <span>الإجمالي الفرعي</span>
                <span className="font-heading text-lg font-bold text-brand-700">
                  {formatPrice(cartTotal(items))}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={close}
                className="block w-full rounded-full bg-brand-600 py-3 text-center text-sm font-semibold text-white shadow-sm shadow-brand-300 transition hover:bg-brand-700"
              >
                إتمام الطلب
              </Link>
              <Link
                href="/cart"
                onClick={close}
                className="mt-2 block w-full rounded-full border border-brand-200 py-2.5 text-center text-sm font-medium text-brand-700 hover:bg-brand-50"
              >
                عرض السلة كاملة
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
