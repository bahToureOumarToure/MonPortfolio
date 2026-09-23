import { requireAdmin } from "@/lib/auth/admin";
import { getAdminSettings } from "@/lib/admin-queries";
import SettingsForm from "@/components/admin/SettingsForm";
import ResumeUploader from "@/components/admin/ResumeUploader";

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

  const currentResume = s?.publishedResume
    ? { url: s.publishedResume.url, filename: s.publishedResume.filename }
    : null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Paramètres</h1>
        <p className="text-slate-400 mt-1">
          Informations générales, coordonnées, footer et CV.
        </p>
      </div>
      <SettingsForm initial={initial} />
      <ResumeUploader current={currentResume} />
    </div>
  );
}
