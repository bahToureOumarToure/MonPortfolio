import { requireAdmin } from "@/lib/auth/admin";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <AdminNav email={user.email} />
      <main className="flex-1 min-w-0 p-6 lg:p-10">{children}</main>
    </div>
  );
}
