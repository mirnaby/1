import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "brand",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  accent?: "brand" | "gold";
}) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-500">{label}</p>
          <p className="mt-2 font-heading text-2xl font-bold text-ink-900 tabular-nums">
            {value}
          </p>
        </div>
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            accent === "gold"
              ? "bg-gold-300/40 text-gold-600"
              : "bg-brand-50 text-brand-600"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {trend && (
        <p
          className={`mt-3 text-xs font-semibold ${
            trend.positive ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {trend.positive ? "▲" : "▼"} {trend.value}
        </p>
      )}
    </div>
  );
}
