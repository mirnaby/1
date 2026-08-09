import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone, MapPin, ExternalLink } from "lucide-react";
import { getCustomerById, getOrdersByCustomerId } from "@/lib/data";
import { formatPrice, formatDate, statusColor, statusLabel } from "@/lib/format";

export default async function AdminCustomerDetailPage({
  params,
}: PageProps<"/admin/customers/[id]">) {
  const { id } = await params;
  const customer = await getCustomerById(decodeURIComponent(id));

  if (!customer) notFound();

  const orders = await getOrdersByCustomerId(customer.id);
  const totalSpent = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى العملاء
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <div className="h-fit space-y-5 rounded-2xl border border-brand-100 bg-white p-6">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-200 to-brand-400 font-heading text-xl font-bold text-white">
              {customer.name.slice(0, 1)}
            </span>
            <p className="mt-3 font-heading text-lg font-bold text-ink-900">
              {customer.name}
            </p>
            <p className="text-xs text-ink-500">
              عميلة منذ {formatDate(customer.createdAt)}
            </p>
          </div>

          <div className="space-y-2.5 border-t border-brand-50 pt-4 text-sm text-ink-700">
            <p className="flex items-center gap-2" dir="ltr">
              <Phone className="h-4 w-4 text-brand-500" />
              {customer.phone}
            </p>
            {customer.address && (
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                <span>{customer.address}</span>
              </p>
            )}
            {customer.lat != null && customer.lng != null && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${customer.lat},${customer.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-600 hover:text-brand-800"
              >
                <ExternalLink className="h-4 w-4" />
                فتح الموقع في خرائط قوقل
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-brand-50 pt-4">
            <div>
              <p className="text-xs text-ink-500">عدد الطلبات</p>
              <p className="font-heading text-lg font-bold text-ink-900">
                {orders.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-500">إجمالي الإنفاق</p>
              <p className="font-heading text-lg font-bold text-brand-700">
                {formatPrice(totalSpent)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-100 bg-white p-5">
          <h2 className="mb-4 font-heading text-base font-bold text-ink-900">
            سجل الطلبات
          </h2>
          {orders.length === 0 ? (
            <p className="text-sm text-ink-500">لا توجد طلبات بعد</p>
          ) : (
            <ul className="space-y-3">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between rounded-xl border border-brand-50 px-4 py-3 transition hover:border-brand-200 hover:bg-brand-50/40"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink-900">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-ink-500">
                        {formatDate(order.createdAt)} ·{" "}
                        {order.items.reduce((s, i) => s + i.quantity, 0)} قطعة
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: statusColor(order.status).bg,
                          color: statusColor(order.status).text,
                        }}
                      >
                        {statusLabel(order.status)}
                      </span>
                      <span className="font-semibold text-ink-900">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
