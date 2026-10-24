import { requireAdmin } from "@/lib/auth/admin";
import AdminNav from "@/components/admin/AdminNav";
import { Toaster } from "@/components/admin/toaster";

export const dynamic = "force-dynamic";

export default async function AdminDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <Toaster>
      <div className="min-h-screen bg-muted/40 lg:flex">
        <AdminNav email={user.email} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto flex max-w-5xl flex-col gap-8">
            {children}
          </div>
        </main>
      </div>
    </Toaster>
  );
}
