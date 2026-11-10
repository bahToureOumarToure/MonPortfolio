import { requireAdmin } from "@/lib/auth/admin";
import { getAdminActivities } from "@/lib/admin-queries";
import ActivitiesManager from "@/components/admin/ActivitiesManager";
import { PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function ActivitiesAdminPage() {
  await requireAdmin();
  const rows = (await getAdminActivities().catch(() => [])).map((r) => ({
    id: r.id,
    title: r.title,
    subtitle: r.organization,
    duration: r.duration,
    details: r.details,
    active: r.active,
    translations: r.translations,
  }));

  return (
    <>
      <PageHeader
        title="Activités extra-universitaires"
        description="Bénévolat, associations, clubs, événements — affichés dans la section « Parcours » du site. Saisis le texte en anglais, puis les traductions dans les onglets."
      />
      <ActivitiesManager initial={rows} />
    </>
  );
}
