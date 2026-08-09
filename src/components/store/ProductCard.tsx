import Link from "next/link";
import { Star } from "lucide-react";
import { ProductVisual } from "./ProductVisual";
import { QuickAddButton } from "./QuickAddButton";
import { formatPrice } from "@/lib/format";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    emoji: string;
    gradientFrom: string;
    gradientTo: string;
    imageUrl: string | null;
    rating: number;
    reviewsCount: number;
    stock: number;
    category: { name: string };
  };
};

export function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-200/40"
    >
      <div className="relative">
        <ProductVisual
          emoji={product.emoji}
          gradientFrom={product.gradientFrom}
          gradientTo={product.gradientTo}
          imageUrl={product.imageUrl}
          className="aspect-square w-full"
          emojiClassName="text-6xl transition-transform duration-300 group-hover:scale-110"
        />
        {product.compareAtPrice && (
          <span className="absolute right-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white">
            خصم {Math.round(100 - (product.price / product.compareAtPrice) * 100)}٪
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink-900/40 text-sm font-bold text-white">
            نفدت الكمية
          </span>
        )}
        <div className="absolute bottom-3 left-3">
          <QuickAddButton product={product} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-xs font-medium text-brand-500">
          {product.category.name}
        </span>
        <h3 className="line-clamp-1 font-heading text-sm font-bold text-ink-900">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-ink-500">
          <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
          <span>{product.rating.toFixed(1)}</span>
          <span>({product.reviewsCount})</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-heading text-base font-bold text-brand-700">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-ink-500 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
