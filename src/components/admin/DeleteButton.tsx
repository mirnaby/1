"use client";

import { useState, useTransition } from "react";
import { Trash2, X } from "lucide-react";

export function DeleteButton({
  action,
  hiddenName,
  hiddenValue,
  confirmText,
}: {
  action: (formData: FormData) => Promise<void>;
  hiddenName: string;
  hiddenValue: string;
  confirmText: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="relative flex items-center gap-1.5">
        <form
          action={(formData) => {
            setError(null);
            startTransition(async () => {
              try {
                await action(formData);
                setConfirming(false);
              } catch (err) {
                setError(err instanceof Error ? err.message : "تعذر الحذف");
              }
            });
          }}
        >
          <input type="hidden" name={hiddenName} value={hiddenValue} />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "..." : confirmText}
          </button>
        </form>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-lg p-1.5 text-ink-500 hover:bg-brand-50"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        {error && (
          <span className="absolute mt-10 rounded-lg bg-red-50 px-2 py-1 text-xs text-red-700">
            {error}
          </span>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-lg p-1.5 text-ink-500 hover:bg-red-50 hover:text-red-600"
      aria-label="حذف"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
