import { requireAdmin } from "@/lib/auth/admin";
import { getAdminExperiences } from "@/lib/admin-queries";
import ExperienceManager from "@/components/admin/ExperienceManager";
import { PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function ExperienceAdminPage() {
  await requireAdmin();
  const rows = (await getAdminExperiences().catch(() => [])).map((r) => ({
    id: r.id,
    title: r.title,
    subtitle: r.company,
    duration: r.duration,
    details: r.details,
    active: r.active,
  }));

  return (
    <>
      <PageHeader
        title="Expérience"
        description="Stages, missions et recherches en cours — section « Parcours » du site."
      />
      <ExperienceManager initial={rows} />
    </>
  );
}
