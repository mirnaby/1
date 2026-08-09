import { getCategories, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/store/ProductCard";
import { SortSelect } from "@/components/store/SortSelect";
import { Search } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const params = await searchParams;
  const categorySlug =
    typeof params.category === "string" ? params.category : undefined;
  const search = typeof params.q === "string" ? params.q : undefined;
  const sort = typeof params.sort === "string" ? params.sort : undefined;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug, search, sort }),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink-900">
          {activeCategory ? activeCategory.name : "كل المنتجات"}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          {products.length} منتج متوفر
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-6">
          <form action="/products" className="space-y-2">
            {categorySlug && (
              <input type="hidden" name="category" value={categorySlug} />
            )}
            <div className="relative">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
              <input
                type="text"
                name="q"
                defaultValue={search}
                placeholder="ابحثي عن منتج..."
                className="w-full rounded-full border border-brand-200 bg-white py-2.5 pr-9 pl-4 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </form>

          <div>
            <h3 className="mb-3 font-heading text-sm font-bold text-ink-900">
              الفئات
            </h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="/products"
                  className={`block rounded-lg px-3 py-2 text-sm transition ${
                    !categorySlug
                      ? "bg-brand-600 font-semibold text-white"
                      : "text-ink-700 hover:bg-brand-50"
                  }`}
                >
                  جميع المنتجات
                </a>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/products?category=${cat.slug}`}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                      categorySlug === cat.slug
                        ? "bg-brand-600 font-semibold text-white"
                        : "text-ink-700 hover:bg-brand-50"
                    }`}
                  >
                    <span>
                      {cat.emoji} {cat.name}
                    </span>
                    <span
                      className={
                        categorySlug === cat.slug
                          ? "text-brand-100"
                          : "text-ink-500"
                      }
                    >
                      {cat.productCount}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex justify-end">
            <form action="/products" className="flex items-center gap-2">
              {categorySlug && (
                <input type="hidden" name="category" value={categorySlug} />
              )}
              {search && <input type="hidden" name="q" value={search} />}
              <label className="text-sm text-ink-500">ترتيب حسب</label>
              <SortSelect defaultValue={sort ?? "newest"} />
            </form>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-brand-200 py-20 text-center">
              <p className="font-heading text-lg font-bold text-ink-900">
                لا توجد منتجات مطابقة
              </p>
              <p className="text-sm text-ink-500">جربي تغيير الفئة أو البحث</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
