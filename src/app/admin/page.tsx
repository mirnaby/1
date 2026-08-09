import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Users,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { getOrdersWithCustomers, getAllCustomers, getProducts } from "@/lib/data";
import { StatCard } from "@/components/admin/StatCard";
import { SalesAreaChart } from "@/components/admin/charts/SalesAreaChart";
import { CategoryBarChart } from "@/components/admin/charts/CategoryBarChart";
import { StatusDonutChart } from "@/components/admin/charts/StatusDonutChart";
import { formatPrice, formatDateShort, statusColor, statusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [orders, allCustomers, products] = await Promise.all([
    getOrdersWithCustomers(),
    getAllCustomers(),
    getProducts({}),
  ]);
  const customersCount = allCustomers.length;
  const categoryByProductId = new Map(products.map((p) => [p.id, p.category.name]));

  const validOrders = orders.filter((o) => o.status !== "CANCELLED");
  const totalRevenue = validOrders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = validOrders.length ? totalRevenue / validOrders.length : 0;
  const lowStockProducts = products
    .filter((p) => p.stock <= 10)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  const days = 14;
  const salesByDay = Array.from({ length: days }).map((_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - idx));
    date.setHours(0, 0, 0, 0);
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    const total = orders
      .filter((o) => o.createdAt >= date && o.createdAt < next && o.status !== "CANCELLED")
      .reduce((s, o) => s + o.total, 0);
    return { label: formatDateShort(date), total };
  });

  const revenueByCategory = new Map<string, number>();
  for (const order of validOrders) {
    for (const item of order.items) {
      const catName = categoryByProductId.get(item.productId) ?? "أخرى";
      revenueByCategory.set(
        catName,
        (revenueByCategory.get(catName) ?? 0) + item.price * item.quantity
      );
    }
  }
  const categoryData = [...revenueByCategory.entries()]
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue);

  const statusCounts = new Map<string, number>();
  for (const order of orders) {
    statusCounts.set(order.status, (statusCounts.get(order.status) ?? 0) + 1);
  }
  const statusOrder = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
  const statusData = statusOrder
    .filter((s) => statusCounts.has(s))
    .map((status) => ({ status, count: statusCounts.get(status)! }));

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink-900">
          نظرة عامة
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          مرحباً بكِ، إليكِ ملخص أداء متجركِ
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="إجمالي الإيرادات"
          value={formatPrice(totalRevenue)}
          icon={DollarSign}
        />
        <StatCard
          label="عدد الطلبات"
          value={String(orders.length)}
          icon={ShoppingCart}
          accent="gold"
        />
        <StatCard
          label="متوسط قيمة الطلب"
          value={formatPrice(avgOrderValue)}
          icon={DollarSign}
        />
        <StatCard
          label="عدد العملاء"
          value={String(customersCount)}
          icon={Users}
          accent="gold"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-brand-100 bg-white p-5 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-ink-900">
              المبيعات خلال آخر 14 يوماً
            </h2>
          </div>
          <SalesAreaChart data={salesByDay} />
        </div>

        <div className="rounded-2xl border border-brand-100 bg-white p-5">
          <h2 className="mb-4 font-heading text-base font-bold text-ink-900">
            حالة الطلبات
          </h2>
          <StatusDonutChart data={statusData} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-brand-100 bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 font-heading text-base font-bold text-ink-900">
            الإيرادات حسب الفئة
          </h2>
          <CategoryBarChart data={categoryData} />
        </div>

        <div className="rounded-2xl border border-brand-100 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="font-heading text-base font-bold text-ink-900">
              مخزون منخفض
            </h2>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-ink-500">لا توجد منتجات بمخزون منخفض</p>
          ) : (
            <ul className="space-y-3">
              {lowStockProducts.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="line-clamp-1 text-ink-700 hover:text-brand-700"
                  >
                    {p.emoji} {p.name}
                  </Link>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                      p.stock === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {p.stock === 0 ? "نفدت" : `${p.stock} متبقي`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-brand-100 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-base font-bold text-ink-900">
            أحدث الطلبات
          </h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            عرض الكل
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-brand-100 text-right text-ink-500">
                <th className="pb-2 font-medium">رقم الطلب</th>
                <th className="pb-2 font-medium">العميلة</th>
                <th className="pb-2 font-medium">التاريخ</th>
                <th className="pb-2 font-medium">الحالة</th>
                <th className="pb-2 font-medium">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-brand-50 last:border-0">
                  <td className="py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-semibold text-brand-700 hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 text-ink-700">{order.customer.name}</td>
                  <td className="py-3 text-ink-500">{formatDateShort(order.createdAt)}</td>
                  <td className="py-3">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: statusColor(order.status).bg,
                        color: statusColor(order.status).text,
                      }}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-ink-900">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
