import { requireAdmin } from "@/lib/auth/admin";
import { getAdminMedia } from "@/lib/admin-queries";
import MediaLibrary from "@/components/admin/MediaLibrary";
import type { MediaDTO } from "@/lib/actions/media";

export const dynamic = "force-dynamic";

export default async function MediaAdminPage() {
  await requireAdmin();
  const media = await getAdminMedia().catch(() => []);
  const items: MediaDTO[] = media.map((m) => ({
    id: m.id,
    url: m.url,
    filename: m.filename,
    alt: m.alt,
    kind: m.kind,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Médias</h1>
        <p className="text-slate-400 mt-1">
          Téléverse et gère les images. Les fichiers sont stockés sur Vercel
          Blob.
        </p>
      </div>
      <MediaLibrary initial={items} />
    </div>
  );
}
