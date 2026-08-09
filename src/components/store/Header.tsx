import Link from "next/link";
import { CartButton } from "./CartButton";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "كل المنتجات" },
  { href: "/products?category=skincare", label: "العناية بالبشرة" },
  { href: "/products?category=makeup", label: "المكياج" },
  { href: "/products?category=perfumes", label: "العطور" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-cream-50/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-brand-600 text-lg text-white">
            ✿
          </span>
          <span className="font-heading text-xl font-bold text-brand-800">
            لمسة
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/admin"
            className="hidden rounded-full border border-brand-200 px-3.5 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50 sm:block"
          >
            لوحة التحكم
          </Link>
          <CartButton />
        </div>
      </div>
      <div className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
