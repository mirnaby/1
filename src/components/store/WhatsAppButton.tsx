import { getStoreSettings } from "@/lib/data";

export async function WhatsAppButton() {
  const settings = await getStoreSettings();
  const digits = settings.whatsappNumber.replace(/\D/g, "");
  if (!digits) return null;

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصلي معنا عبر واتساب"
      className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white shadow-lg shadow-emerald-900/30 transition hover:scale-105 hover:bg-emerald-600"
    >
      💬
    </a>
  );
}
