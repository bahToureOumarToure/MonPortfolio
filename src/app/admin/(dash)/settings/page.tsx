import { requireAdmin } from "@/lib/auth/admin";
import { getAdminSettings } from "@/lib/admin-queries";
import SettingsForm from "@/components/admin/SettingsForm";
import ResumeUploader from "@/components/admin/ResumeUploader";
import { PageHeader } from "@/components/admin/ui";

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
    translations: s?.translations ?? null,
  };

  const currentResume = s?.publishedResume
    ? { url: s.publishedResume.url, filename: s.publishedResume.filename }
    : null;

  return (
    <>
      <PageHeader
        title="Paramètres & CV"
        description="Coordonnées, référencement, pied de page et CV."
      />
      <SettingsForm initial={initial} />
      <ResumeUploader current={currentResume} />
    </>
  );
}
