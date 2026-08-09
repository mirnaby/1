"use client";

import { ShoppingBag } from "lucide-react";
import { useCart, cartCount } from "@/store/cart";
import { useEffect, useState } from "react";

export function CartButton() {
  const items = useCart((s) => s.items);
  const open = useCart((s) => s.open);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(items) : 0;

  return (
    <button
      onClick={open}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition hover:bg-brand-50 hover:text-brand-600"
      aria-label="عرض السلة"
    >
      <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
