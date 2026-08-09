"use client";

import { useTransition } from "react";
import { statusLabel } from "@/lib/format";

const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export function OrderStatusSelect({
  orderId,
  currentStatus,
  action,
}: {
  orderId: string;
  currentStatus: string;
  action: (orderId: string, formData: FormData) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const boundAction = action.bind(null, orderId);

  return (
    <form
      onChange={(e) => {
        const formData = new FormData(e.currentTarget);
        startTransition(() => {
          boundAction(formData);
        });
      }}
    >
      <select
        name="status"
        defaultValue={currentStatus}
        disabled={isPending}
        className="rounded-full border border-brand-200 bg-white px-3.5 py-2 text-sm font-semibold text-ink-900 focus:border-brand-400 focus:outline-none disabled:opacity-60"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {statusLabel(s)}
          </option>
        ))}
      </select>
    </form>
  );
}
