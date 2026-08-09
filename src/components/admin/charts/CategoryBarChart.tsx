"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatPrice } from "@/lib/format";

type Point = { name: string; revenue: number };

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: Point }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-brand-100 bg-white px-3.5 py-2.5 shadow-lg">
      <p className="text-xs text-ink-500">{payload[0].payload.name}</p>
      <p className="font-heading text-sm font-bold text-brand-700">
        {formatPrice(payload[0].value)}
      </p>
    </div>
  );
}

export function CategoryBarChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
        barCategoryGap={14}
      >
        <CartesianGrid horizontal={false} stroke="#f0e2e8" strokeDasharray="3 5" />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#8b7a86", fontSize: 12 }}
          tickFormatter={(v) => `${Math.round(v / 100) / 10}k`}
        />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          width={110}
          tick={{ fill: "#4a3a47", fontSize: 12 }}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "#fdf2f6" }} />
        <Bar dataKey="revenue" radius={[0, 6, 6, 0]} maxBarSize={22}>
          {data.map((entry) => (
            <Cell key={entry.name} fill="#d6547f" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
