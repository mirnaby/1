import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getOrderByNumber } from "@/lib/data";
import { formatPrice, formatDate, statusLabel } from "@/lib/format";
import { ClearCartOnMount } from "@/components/store/ClearCartOnMount";

export default async function OrderConfirmationPage({
  params,
}: PageProps<"/order-confirmation/[orderNumber]">) {
  const { orderNumber } = await params;

  const order = await getOrderByNumber(orderNumber);

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <ClearCartOnMount />
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckCircle2 className="h-9 w-9" />
      </span>
      <h1 className="mt-6 font-heading text-3xl font-bold text-ink-900">
        شكراً لكِ، تم استلام طلبكِ!
      </h1>
      <p className="mt-2 text-ink-500">
        رقم الطلب <span className="font-bold text-brand-700">{order.orderNumber}</span>{" "}
        بتاريخ {formatDate(order.createdAt)}
      </p>

      <div className="mt-8 rounded-2xl border border-brand-100 bg-white p-6 text-right">
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="text-ink-500">الحالة</span>
          <span className="font-semibold text-brand-700">
            {statusLabel(order.status)}
          </span>
        </div>
        <ul className="space-y-3 border-t border-brand-100 pt-4">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center justify-between text-sm">
              <span className="text-ink-700">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium text-ink-900">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-brand-100 pt-4 font-heading text-base font-bold">
          <span>الإجمالي</span>
          <span className="text-brand-700">{formatPrice(order.total)}</span>
        </div>
      </div>

      <Link
        href="/products"
        className="mt-8 inline-block rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white hover:bg-brand-700"
      >
        متابعة التسوق
      </Link>
    </div>
  );
}
