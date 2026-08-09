import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { ProductVisual } from "@/components/store/ProductVisual";
import { ProductCard } from "@/components/store/ProductCard";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { formatPrice } from "@/lib/format";

export default async function ProductDetailPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(decodeURIComponent(slug));
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/" className="hover:text-brand-600">الرئيسية</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-brand-600">المنتجات</Link>
        <span className="mx-2">/</span>
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-brand-600"
        >
          {product.category.name}
        </Link>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductVisual
          emoji={product.emoji}
          gradientFrom={product.gradientFrom}
          gradientTo={product.gradientTo}
          imageUrl={product.imageUrl}
          className="aspect-square w-full rounded-3xl"
          emojiClassName="text-9xl"
        />

        <div>
          <span className="text-sm font-semibold text-brand-600">
            {product.category.name}
          </span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-ink-900">
            {product.name}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-ink-500">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-gold-500 text-gold-500" />
              <span className="font-semibold text-ink-900">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span>({product.reviewsCount} تقييم)</span>
            <span className="mx-1">·</span>
            <span className={product.stock > 0 ? "text-emerald-600" : "text-red-600"}>
              {product.stock > 0 ? `متوفر (${product.stock} قطعة)` : "غير متوفر"}
            </span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="font-heading text-3xl font-bold text-brand-700">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-ink-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="mt-6 leading-8 text-ink-700">{product.description}</p>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 border-t border-brand-100 pt-6 sm:grid-cols-3">
            {[
              { icon: Truck, text: "شحن سريع لجميع المدن" },
              { icon: ShieldCheck, text: "منتج أصلي 100٪" },
              { icon: RotateCcw, text: "استبدال خلال 14 يوم" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-2 text-xs text-ink-500">
                <f.icon className="h-4 w-4 text-brand-500" />
                {f.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-heading text-2xl font-bold text-ink-900">
            قد يعجبكِ أيضاً
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
