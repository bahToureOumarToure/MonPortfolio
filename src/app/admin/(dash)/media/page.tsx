import { requireAdmin } from "@/lib/auth/admin";
import { getAdminMedia } from "@/lib/admin-queries";
import { prisma } from "@/lib/db";
import { toMediaDTO, type AssignTarget } from "@/lib/media-dto";
import MediaLibrary from "@/components/admin/MediaLibrary";
import { PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function MediaAdminPage() {
  await requireAdmin();
  const [media, targets] = await Promise.all([
    getAdminMedia().catch(() => []),
    prisma.project
      .findMany({
        orderBy: { order: "asc" },
        select: { id: true, legacyId: true, name: true },
      })
      .catch((): AssignTarget[] => []),
  ]);

  const items = media.map((m) =>
    toMediaDTO(
      m,
      m._count.heroImages +
        m._count.profileImages +
        m._count.resumeSettings +
        // une couverture fait aussi partie de la galerie : ne pas compter deux fois
        Math.max(m._count.projectImages, m._count.projectCovers),
    ),
  );

  return (
    <>
      <PageHeader
        title="Médias"
        description="Téléverse tes images (optimisées automatiquement), puis « Utiliser pour… » pour les appliquer au site."
      />
      <MediaLibrary initial={items} targets={targets} />
    </>
  );
}
