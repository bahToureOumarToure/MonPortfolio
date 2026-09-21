import { requireAdmin } from "@/lib/auth/admin";
import { getAdminSettings } from "@/lib/admin-queries";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage() {
  await requireAdmin();
  const s = await getAdminSettings().catch(() => null);

  const initial = {
    siteTitle: s?.siteTitle ?? "Bah Oumar Touré Portfolio",
    metaDescription: s?.metaDescription ?? "",
    contactEmail: s?.contactEmail ?? "",
    phone: s?.phone ?? "",
    address: s?.address ?? "",
    footerTagline: s?.footerTagline ?? "",
    resumeExternalUrl: s?.resumeExternalUrl ?? "",
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Paramètres</h1>
        <p className="text-slate-400 mt-1">
          Informations générales, coordonnées et footer.
        </p>
      </div>
      <SettingsForm initial={initial} />
    </div>
  );
}
