import Link from "next/link";
import { getOrdersWithCustomers } from "@/lib/data";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { updateOrderStatus } from "@/lib/actions/orders";
import { formatPrice, formatDate, statusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default async function AdminOrdersPage({
  searchParams,
}: PageProps<"/admin/orders">) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : undefined;

  const allOrders = await getOrdersWithCustomers();
  const orders = status ? allOrders.filter((o) => o.status === status) : allOrders;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink-900">
          الطلبات
        </h1>
        <p className="mt-1 text-sm text-ink-500">{orders.length} طلب</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Link
          href="/admin/orders"
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
            !status ? "bg-brand-600 text-white" : "bg-brand-50 text-ink-700"
          }`}
        >
          الكل
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              status === s ? "bg-brand-600 text-white" : "bg-brand-50 text-ink-700"
            }`}
          >
            {statusLabel(s)}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-brand-50/60">
              <tr className="text-right text-ink-500">
                <th className="px-4 py-3 font-medium">رقم الطلب</th>
                <th className="px-4 py-3 font-medium">العميلة</th>
                <th className="px-4 py-3 font-medium">التاريخ</th>
                <th className="px-4 py-3 font-medium">عدد القطع</th>
                <th className="px-4 py-3 font-medium">الإجمالي</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-brand-50">
                  <td className="px-4 py-3 font-semibold text-ink-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3 text-ink-700">{order.customer.name}</td>
                  <td className="px-4 py-3 text-ink-500">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3 text-ink-700">
                    {order.items.reduce((s, i) => s + i.quantity, 0)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink-900">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                      action={updateOrderStatus}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                    >
                      عرض
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <p className="py-16 text-center text-sm text-ink-500">لا توجد طلبات</p>
        )}
      </div>
    </div>
  );
}
