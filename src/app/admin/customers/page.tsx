import Link from "next/link";
import { Phone } from "lucide-react";
import { getAllCustomers, getAllOrders } from "@/lib/data";
import { formatPrice, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage({
  searchParams,
}: PageProps<"/admin/customers">) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : undefined;

  const [allCustomers, allOrders] = await Promise.all([getAllCustomers(), getAllOrders()]);
  const filtered = search
    ? allCustomers.filter((c) => {
        const q = search.trim().toLowerCase();
        return c.name.toLowerCase().includes(q) || c.phone.includes(q);
      })
    : allCustomers;
  const customers = filtered.map((c) => ({
    ...c,
    orders: allOrders.filter((o) => o.customerId === c.id),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink-900">
          العملاء
        </h1>
        <p className="mt-1 text-sm text-ink-500">{customers.length} عميلة</p>
      </div>

      <form action="/admin/customers" className="max-w-sm">
        <input
          type="text"
          name="q"
          defaultValue={search}
          placeholder="ابحثي بالاسم أو رقم الهاتف..."
          className="w-full rounded-full border border-brand-200 bg-white px-4 py-2 text-sm focus:border-brand-400 focus:outline-none"
        />
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer) => {
          const totalSpent = customer.orders
            .filter((o) => o.status !== "CANCELLED")
            .reduce((s, o) => s + o.total, 0);
          return (
            <Link
              key={customer.id}
              href={`/admin/customers/${customer.id}`}
              className="flex flex-col gap-3 rounded-2xl border border-brand-100 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-200/40"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-200 to-brand-400 font-heading text-sm font-bold text-white">
                  {customer.name.slice(0, 1)}
                </span>
                <div>
                  <p className="font-semibold text-ink-900">{customer.name}</p>
                  <p className="text-xs text-ink-500">
                    عميلة منذ {formatDate(customer.createdAt)}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-ink-500">
                <p className="flex items-center gap-1.5" dir="ltr">
                  <Phone className="h-3.5 w-3.5" />
                  {customer.phone}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-brand-50 pt-3 text-sm">
                <span className="text-ink-500">{customer.orders.length} طلب</span>
                <span className="font-semibold text-brand-700">
                  {formatPrice(totalSpent)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {customers.length === 0 && (
        <p className="py-16 text-center text-sm text-ink-500">لا توجد نتائج</p>
      )}
    </div>
  );
}
