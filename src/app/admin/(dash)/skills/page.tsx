import { requireAdmin } from "@/lib/auth/admin";
import { getAdminSkills } from "@/lib/admin-queries";
import SkillsManager, { type SkillRow } from "@/components/admin/SkillsManager";

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
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Compétences</h1>
        <p className="text-slate-400 mt-1">{rows.length} compétence(s)</p>
      </div>
      <SkillsManager initial={rows} />
    </div>
  );
}
