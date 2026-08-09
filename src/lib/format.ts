export function formatPrice(value: number) {
  return new Intl.NumberFormat("ar-IQ", {
    style: "currency",
    currency: "IQD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDateShort(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("ar-SA").format(value);
}

const statusLabels: Record<string, string> = {
  PENDING: "قيد الانتظار",
  PROCESSING: "قيد المعالجة",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التسليم",
  CANCELLED: "ملغي",
};

export function statusLabel(status: string) {
  return statusLabels[status] ?? status;
}

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: "#fef3c7", text: "#92640a", dot: "#fab219" },
  PROCESSING: { bg: "#ede9fe", text: "#4c3a9e", dot: "#4a3aa7" },
  SHIPPED: { bg: "#dbeafe", text: "#1e4f8f", dot: "#2a78d6" },
  DELIVERED: { bg: "#dcfce7", text: "#0a6b0a", dot: "#0ca30c" },
  CANCELLED: { bg: "#fee2e2", text: "#a12727", dot: "#d03b3b" },
};

export function statusColor(status: string) {
  return statusColors[status] ?? statusColors.PENDING;
}
