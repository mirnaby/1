"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "نظرة عامة", exact: true },
  { href: "/admin/products", label: "المنتجات" },
  { href: "/admin/orders", label: "الطلبات" },
  { href: "/admin/customers", label: "العملاء" },
  { href: "/admin/settings", label: "الإعدادات" },
];

export function MobileTabs() {
  const pathname = usePathname();
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-brand-100 bg-white px-3 py-2 md:hidden">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
              active
                ? "bg-brand-600 text-white"
                : "bg-brand-50 text-ink-700"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
