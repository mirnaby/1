import Link from "next/link";
import { ArrowLeft, Sparkles, Truck, ShieldCheck, Gift } from "lucide-react";
import { getCategories, getFeaturedProducts } from "@/lib/data";
import { ProductCard } from "@/components/store/ProductCard";

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-brand-100 via-cream-50 to-cream-50" />
        <div
          className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-200/50 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute top-32 -right-16 h-72 w-72 rounded-full bg-gold-300/40 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white/70 px-4 py-1.5 text-xs font-semibold text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            جمالكِ يستحق لمسة فاخرة
          </span>
          <h1 className="max-w-2xl font-heading text-4xl font-extrabold leading-tight text-ink-900 sm:text-5xl">
            اكتشفي عالماً من الجمال
            <span className="text-brand-600"> والعناية الفاخرة</span>
          </h1>
          <p className="max-w-xl text-base leading-8 text-ink-500 sm:text-lg">
            مستحضرات تجميل وعناية بالبشرة والشعر وعطور مختارة بعناية لتمنحكِ
            إشراقة طبيعية تدوم.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-300/60 transition hover:bg-brand-700"
            >
              تسوقي الآن
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              href="/products?category=perfumes"
              className="inline-flex items-center gap-2 rounded-full border border-brand-300 bg-white/70 px-7 py-3.5 text-sm font-bold text-brand-700 transition hover:bg-white"
            >
              تصفحي العطور
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-brand-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { icon: Truck, title: "شحن سريع", desc: "توصيل خلال 2-4 أيام لجميع المدن" },
            { icon: ShieldCheck, title: "منتجات أصلية", desc: "ضمان الجودة على كل قطعة" },
            { icon: Gift, title: "تغليف فاخر", desc: "تغليف أنيق مع كل طلب" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-heading text-sm font-bold text-ink-900">
                  {item.title}
                </p>
                <p className="text-xs text-ink-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-ink-900">
              تسوقي حسب الفئة
            </h2>
            <p className="mt-1 text-sm text-ink-500">كل ما تحتاجينه في مكان واحد</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-brand-100 bg-white p-6 text-center transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-200/40"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-200 text-2xl transition group-hover:scale-110">
                {cat.emoji}
              </span>
              <span className="font-heading text-sm font-bold text-ink-900">
                {cat.name}
              </span>
              <span className="text-xs text-ink-500">
                {cat.productCount} منتج
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-ink-900">
                الأكثر تميزاً
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                مختارات مميزة يعشقها عملاؤنا
              </p>
            </div>
            <Link
              href="/products"
              className="hidden items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800 sm:flex"
            >
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-l from-brand-700 via-brand-600 to-brand-500 px-8 py-14 text-center text-white sm:px-16">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            انضمي إلى نادي لمسة
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-brand-50 sm:text-base">
            كوني أول من يعلم بالمنتجات الجديدة والعروض الحصرية والخصومات الخاصة
            بعملائنا المميزين.
          </p>
          <form className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1 rounded-full border-0 px-5 py-3 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
            <button
              type="submit"
              className="rounded-full bg-gold-500 px-6 py-3 text-sm font-bold text-ink-900 transition hover:bg-gold-400"
            >
              اشتركي الآن
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
