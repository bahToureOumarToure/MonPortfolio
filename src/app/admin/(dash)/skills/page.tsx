import { requireAdmin } from "@/lib/auth/admin";
import { getAdminSkills } from "@/lib/admin-queries";
import SkillsManager, { type SkillRow } from "@/components/admin/SkillsManager";
import { PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function SkillsAdminPage() {
  await requireAdmin();
  const skills = await getAdminSkills().catch(() => []);
  const rows: SkillRow[] = skills.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    iconKey: s.iconKey ?? "",
    color: s.color ?? "",
    order: s.order,
    active: s.active,
  }));

  return (
    <>
      <PageHeader
        title="Compétences"
        description={`${rows.length} compétence${rows.length > 1 ? "s" : ""}, regroupées par catégorie sur le site.`}
      />
      <SkillsManager initial={rows} />
    </>
  );
}
