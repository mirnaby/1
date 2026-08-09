import { getStoreSettings } from "@/lib/data";
import { updateStoreSettings } from "@/lib/actions/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink-900">
          الإعدادات
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          بيانات التواصل الظاهرة للزبائن بالمتجر
        </p>
      </div>

      <SettingsForm action={updateStoreSettings} defaults={settings} />
    </div>
  );
}
