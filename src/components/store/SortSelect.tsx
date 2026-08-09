"use client";

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <select
      name="sort"
      defaultValue={defaultValue}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      className="rounded-full border border-brand-200 bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
    >
      <option value="newest">الأحدث</option>
      <option value="price-asc">السعر: الأقل أولاً</option>
      <option value="price-desc">السعر: الأعلى أولاً</option>
      <option value="rating">الأعلى تقييماً</option>
    </select>
  );
}
