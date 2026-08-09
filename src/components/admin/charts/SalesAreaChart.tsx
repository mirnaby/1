"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@/lib/format";

type Point = { label: string; total: number };

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-brand-100 bg-white px-3.5 py-2.5 shadow-lg">
      <p className="text-xs text-ink-500">{label}</p>
      <p className="font-heading text-sm font-bold text-brand-700">
        {formatPrice(payload[0].value)}
      </p>
    </div>
  );
}

export function SalesAreaChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d6547f" stopOpacity={0.32} />
            <stop offset="100%" stopColor="#d6547f" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#f0e2e8" strokeDasharray="3 5" />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#8b7a86", fontSize: 12 }}
          interval="preserveStartEnd"
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#8b7a86", fontSize: 12 }}
          width={44}
          tickFormatter={(v) => `${Math.round(v / 100) / 10}k`}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#e879a2", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#b83b64"
          strokeWidth={2}
          fill="url(#salesFill)"
          activeDot={{ r: 5, fill: "#b83b64", stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
