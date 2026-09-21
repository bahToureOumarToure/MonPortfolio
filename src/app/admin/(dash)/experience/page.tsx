import { requireAdmin } from "@/lib/auth/admin";
import { getAdminExperiences } from "@/lib/admin-queries";
import ExperienceManager, {
  type ExperienceRow,
} from "@/components/admin/ExperienceManager";

export const dynamic = "force-dynamic";

export default async function ExperienceAdminPage() {
  await requireAdmin();
  const items = await getAdminExperiences().catch(() => []);
  const rows: ExperienceRow[] = items.map((e) => ({
    id: e.id,
    title: e.title,
    company: e.company,
    duration: e.duration,
    details: e.details,
    order: e.order,
    active: e.active,
  }));

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Stage / Parcours</h1>
        <p className="text-slate-400 mt-1">{rows.length} entrée(s)</p>
      </div>
      <ExperienceManager initial={rows} />
    </div>
  );
}
