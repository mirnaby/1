import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { getCategories, getProducts } from "@/lib/data";
import { ProductVisual } from "@/components/store/ProductVisual";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteProduct } from "@/lib/actions/products";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: PageProps<"/admin/products">) {
  const params = await searchParams;
  const categorySlug =
    typeof params.category === "string" ? params.category : undefined;
  const search = typeof params.q === "string" ? params.q : undefined;

  const [products, categories] = await Promise.all([
    getProducts({ categorySlug, search, sort: "newest" }),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink-900">
            المنتجات
          </h1>
          <p className="mt-1 text-sm text-ink-500">{products.length} منتج</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          منتج جديد
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-brand-100 bg-white p-4">
        <form action="/admin/products" className="flex-1">
          {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="ابحثي عن منتج بالاسم..."
            className="w-full rounded-full border border-brand-200 px-4 py-2 text-sm focus:border-brand-400 focus:outline-none"
          />
        </form>
        <div className="flex flex-wrap gap-1.5">
          <Link
            href="/admin/products"
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              !categorySlug ? "bg-brand-600 text-white" : "bg-brand-50 text-ink-700"
            }`}
          >
            الكل
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/admin/products?category=${c.slug}`}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                categorySlug === c.slug ? "bg-brand-600 text-white" : "bg-brand-50 text-ink-700"
              }`}
            >
              {c.emoji} {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-brand-50/60">
              <tr className="text-right text-ink-500">
                <th className="px-4 py-3 font-medium">المنتج</th>
                <th className="px-4 py-3 font-medium">الفئة</th>
                <th className="px-4 py-3 font-medium">السعر</th>
                <th className="px-4 py-3 font-medium">المخزون</th>
                <th className="px-4 py-3 font-medium">التقييم</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-brand-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProductVisual
                        emoji={product.emoji}
                        gradientFrom={product.gradientFrom}
                        gradientTo={product.gradientTo}
                        imageUrl={product.imageUrl}
                        className="h-11 w-11 shrink-0 rounded-lg"
                        emojiClassName="text-lg"
                      />
                      <div>
                        <p className="line-clamp-1 font-semibold text-ink-900">
                          {product.name}
                        </p>
                        {product.featured && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-600">
                            <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
                            مميز
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{product.category.name}</td>
                  <td className="px-4 py-3 font-semibold text-ink-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        product.stock === 0
                          ? "bg-red-100 text-red-700"
                          : product.stock <= 10
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-700">
                    {product.rating.toFixed(1)} ({product.reviewsCount})
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                      >
                        تعديل
                      </Link>
                      <DeleteButton
                        action={deleteProduct}
                        hiddenName="productId"
                        hiddenValue={product.id}
                        confirmText="تأكيد الحذف"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <p className="py-16 text-center text-sm text-ink-500">لا توجد منتجات</p>
        )}
      </div>
    </div>
  );
}
