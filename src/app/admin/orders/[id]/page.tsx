import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone, MapPin, ExternalLink } from "lucide-react";
import { getOrderById } from "@/lib/data";
import { ProductVisual } from "@/components/store/ProductVisual";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { updateOrderStatus } from "@/lib/actions/orders";
import { formatPrice, formatDate } from "@/lib/format";

export default async function AdminOrderDetailPage({
  params,
}: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى الطلبات
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink-900">
            طلب {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            بتاريخ {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusSelect
          orderId={order.id}
          currentStatus={order.status}
          action={updateOrderStatus}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-brand-100 bg-white p-5">
          <h2 className="mb-4 font-heading text-base font-bold text-ink-900">
            المنتجات
          </h2>
          <ul className="space-y-4">
            {order.items.map((item) => (
              <li key={item.productId} className="flex items-center gap-4">
                <ProductVisual
                  emoji={item.emoji}
                  gradientFrom={item.gradientFrom}
                  gradientTo={item.gradientTo}
                  imageUrl={item.imageUrl}
                  className="h-14 w-14 shrink-0 rounded-xl"
                  emojiClassName="text-xl"
                />
                <div className="flex-1">
                  <Link
                    href={`/admin/products/${item.productId}/edit`}
                    className="font-semibold text-ink-900 hover:text-brand-700"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-ink-500">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <span className="font-semibold text-ink-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-brand-100 pt-4 font-heading text-lg font-bold">
            <span>الإجمالي</span>
            <span className="text-brand-700">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-100 bg-white p-5">
            <h2 className="mb-4 font-heading text-base font-bold text-ink-900">
              بيانات العميلة
            </h2>
            <Link
              href={`/admin/customers/${order.customer.id}`}
              className="font-semibold text-brand-700 hover:underline"
            >
              {order.customer.name}
            </Link>
            <div className="mt-3 space-y-2 text-sm text-ink-700">
              <p className="flex items-center gap-2" dir="ltr">
                <Phone className="h-4 w-4 text-brand-500" />
                {order.customer.phone}
              </p>
              {order.customer.address && (
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                  <span>{order.customer.address}</span>
                </p>
              )}
              {order.customer.lat != null && order.customer.lng != null && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${order.customer.lat},${order.customer.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-brand-600 hover:text-brand-800"
                >
                  <ExternalLink className="h-4 w-4" />
                  فتح الموقع في خرائط قوقل
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
