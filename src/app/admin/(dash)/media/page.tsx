import { requireAdmin } from "@/lib/auth/admin";
import { getAdminMedia } from "@/lib/admin-queries";
import MediaLibrary from "@/components/admin/MediaLibrary";
import type { MediaDTO, AssignTarget } from "@/lib/actions/media";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MediaAdminPage() {
  await requireAdmin();
  const media = await getAdminMedia().catch(() => []);
  const projects = await prisma.project
    .findMany({
      orderBy: { order: "asc" },
      select: { id: true, legacyId: true, name: true },
    })
    .catch(() => []);

  const items: MediaDTO[] = media.map((m) => ({
    id: m.id,
    url: m.url,
    filename: m.filename,
    alt: m.alt,
    kind: m.kind,
    width: m.width,
    height: m.height,
    createdAt: m.createdAt.toISOString(),
  }));
  const targets: AssignTarget[] = projects;

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Médias</h1>
        <p className="text-slate-400 mt-1">
          Téléverse une image puis clique « Utiliser pour… » pour l'appliquer
          directement au site (profil ou projet). Stockage sur Vercel Blob.
        </p>
      </div>
      <MediaLibrary initial={items} targets={targets} />
    </div>
  );
}
