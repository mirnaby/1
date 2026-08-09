"use client";

import { useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import type { StoreSettings } from "@/lib/types";

export function SettingsForm({
  action,
  defaults,
}: {
  action: (formData: FormData) => Promise<void>;
  defaults: StoreSettings;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setError(null);
        setSaved(false);
        startTransition(async () => {
          try {
            await action(formData);
            setSaved(true);
          } catch (err) {
            unstable_rethrow(err);
            setError(err instanceof Error ? err.message : "حدث خطأ ما");
          }
        });
      }}
      className="max-w-xl space-y-5 rounded-2xl border border-brand-100 bg-white p-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-ink-700">
          رقم واتساب المتجر
        </label>
        <input
          name="whatsappNumber"
          dir="ltr"
          defaultValue={defaults.whatsappNumber}
          placeholder="9647701234567"
          className="w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <p className="mt-1 text-xs text-ink-500">
          بصيغة دولية بدون + أو مسافات أو أصفار بالبداية، مثال: 9647701234567
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink-700">
          رقم الهاتف الظاهر للزبائن
        </label>
        <input
          name="phoneNumber"
          dir="ltr"
          defaultValue={defaults.phoneNumber}
          placeholder="+964 770 123 4567"
          className="w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      {saved && !error && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          تم حفظ الإعدادات بنجاح
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {isPending ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
      </button>
    </form>
  );
}
