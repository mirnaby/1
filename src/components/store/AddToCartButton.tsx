"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/store/cart";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    emoji: string;
    gradientFrom: string;
    gradientTo: string;
    imageUrl: string | null;
    stock: number;
  };
};

export function AddToCartButton({ product }: Props) {
  const addItem = useCart((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock === 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-3 rounded-full border border-brand-200 px-3 py-2">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full text-ink-700 hover:bg-brand-50"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full text-ink-700 hover:bg-brand-50"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <button
        disabled={outOfStock}
        onClick={() => {
          addItem(
            {
              productId: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              emoji: product.emoji,
              gradientFrom: product.gradientFrom,
              gradientTo: product.gradientTo,
              imageUrl: product.imageUrl,
              stock: product.stock,
            },
            quantity
          );
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-300/50 transition hover:bg-brand-700 disabled:pointer-events-none disabled:opacity-40 sm:flex-none"
      >
        {outOfStock ? (
          "نفدت الكمية"
        ) : added ? (
          <>
            <Check className="h-4 w-4" /> أُضيف إلى السلة
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" /> أضيفي إلى السلة
          </>
        )}
      </button>
    </div>
  );
}
