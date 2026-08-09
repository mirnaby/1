"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { statusColor, statusLabel } from "@/lib/format";

type Point = { status: string; count: number };

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: Point }[];
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-xl border border-brand-100 bg-white px-3.5 py-2.5 shadow-lg">
      <p className="text-xs text-ink-500">{statusLabel(p.status)}</p>
      <p className="font-heading text-sm font-bold text-ink-900">{p.count} طلب</p>
    </div>
  );
}

export function StatusDonutChart({ data }: { data: Point[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative h-48 w-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={58}
              outerRadius={80}
              paddingAngle={3}
              cornerRadius={4}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.status} fill={statusColor(entry.status).dot} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-2xl font-bold text-ink-900 tabular-nums">
            {total}
          </span>
          <span className="text-xs text-ink-500">إجمالي الطلبات</span>
        </div>
      </div>

      <ul className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-1">
        {data.map((entry) => (
          <li key={entry.status} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-ink-700">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: statusColor(entry.status).dot }}
              />
              {statusLabel(entry.status)}
            </span>
            <span className="font-semibold text-ink-900 tabular-nums">
              {entry.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
