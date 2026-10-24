import { requireAdmin } from "@/lib/auth/admin";
import { getAdminSocials } from "@/lib/admin-queries";
import SocialsManager, {
  type SocialRow,
} from "@/components/admin/SocialsManager";
import { PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function SocialsAdminPage() {
  await requireAdmin();
  const rows: SocialRow[] = (await getAdminSocials().catch(() => [])).map(
    (r) => ({
      id: r.id,
      platform: r.platform,
      url: r.url,
      iconKey: r.iconKey ?? "",
      color: r.color ?? "",
      order: r.order,
      active: r.active,
    }),
  );

  return (
    <>
      <PageHeader
        title="Liens sociaux"
        description="Affichés dans le hero, la section contact et le pied de page, dans cet ordre."
      />
      <SocialsManager initial={rows} />
    </>
  );
}
