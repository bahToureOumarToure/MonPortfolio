import { requireAdmin } from "@/lib/auth/admin";
import { getAdminEducations } from "@/lib/admin-queries";
import EducationManager from "@/components/admin/EducationManager";
import { PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function EducationAdminPage() {
  await requireAdmin();
  const rows = (await getAdminEducations().catch(() => [])).map((r) => ({
    id: r.id,
    title: r.title,
    subtitle: r.institution,
    duration: r.duration,
    details: [],
    active: r.active,
    translations: r.translations,
  }));

  return (
    <>
      <PageHeader
        title="Formation"
        description="Diplômes et établissements — section « Parcours » du site."
      />
      <EducationManager initial={rows} />
    </>
  );
}
