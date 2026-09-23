import { requireAdmin } from "@/lib/auth/admin";
import { getAdminSocials } from "@/lib/admin-queries";
import SocialsManager, {
  type SocialRow,
} from "@/components/admin/SocialsManager";

export const dynamic = "force-dynamic";

export default async function SocialsAdminPage() {
  await requireAdmin();
  const socials = await getAdminSocials().catch(() => []);
  const rows: SocialRow[] = socials.map((s) => ({
    id: s.id,
    platform: s.platform,
    url: s.url,
    iconKey: s.iconKey ?? "",
    color: s.color ?? "",
    order: s.order,
    active: s.active,
  }));

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Liens sociaux</h1>
        <p className="text-slate-400 mt-1">{rows.length} lien(s)</p>
      </div>
      <SocialsManager initial={rows} />
    </div>
  );
}
