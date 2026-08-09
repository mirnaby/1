"use client";

import { Plus, Check } from "lucide-react";
import { useState } from "react";
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

export function QuickAddButton({ product }: Props) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          emoji: product.emoji,
          gradientFrom: product.gradientFrom,
          gradientTo: product.gradientTo,
          imageUrl: product.imageUrl,
          stock: product.stock,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      disabled={product.stock === 0}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-700 shadow-md shadow-ink-900/10 transition hover:bg-brand-600 hover:text-white disabled:pointer-events-none disabled:opacity-50"
      aria-label="أضيفي إلى السلة"
    >
      {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  );
}
