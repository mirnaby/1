"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  Settings,
} from "lucide-react";

const links = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
  { href: "/admin/customers", label: "العملاء", icon: Users },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-ink-900 text-white md:flex">
      <div className="flex h-16 items-center gap-2 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-gold-500 text-lg">
          ✿
        </span>
        <div>
          <p className="font-heading text-base font-bold">لمسة</p>
          <p className="text-[11px] text-white/50">لوحة التحكم</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-900/40"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          <Store className="h-5 w-5" />
          العودة إلى المتجر
        </Link>
      </div>
    </aside>
  );
}
