import { Sidebar } from "@/components/admin/Sidebar";
import { MobileTabs } from "@/components/admin/MobileTabs";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-cream-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTabs />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
