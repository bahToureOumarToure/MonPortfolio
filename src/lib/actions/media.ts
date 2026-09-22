"use server";
import { prisma } from "@/lib/db";
import { registerMediaInput } from "@/lib/validation/media";
import { deleteBlob } from "@/lib/blob";
import { assertAdmin, audit, revalidateContent } from "./common";

export interface MediaDTO {
  id: string;
  url: string;
  filename: string;
  alt: string | null;
  kind: "IMAGE" | "DOCUMENT";
  createdAt: string;
}

/** Crée la ligne Media après un upload Blob réussi (appelée côté client). */
export async function registerMedia(input: unknown): Promise<MediaDTO> {
  await assertAdmin();
  const d = registerMediaInput.parse(input);
  const media = await prisma.media.create({
    data: {
      url: d.url,
      pathname: d.pathname || null,
      filename: d.filename,
      mimeType: d.mimeType,
      size: d.size,
      kind: d.kind,
      alt: d.alt ?? null,
    },
  });
  await audit("media.create", "Media", media.id);
  return {
    id: media.id,
    url: media.url,
    filename: media.filename,
    alt: media.alt,
    kind: media.kind,
    createdAt: media.createdAt.toISOString(),
  };
}

/** Liste les médias (pour la médiathèque et le sélecteur d'image). */
export async function listMedia(
  kind?: "IMAGE" | "DOCUMENT",
): Promise<MediaDTO[]> {
  await assertAdmin();
  const rows = await prisma.media.findMany({
    where: kind ? { kind } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return rows.map((m) => ({
    id: m.id,
    url: m.url,
    filename: m.filename,
    alt: m.alt,
    kind: m.kind,
    createdAt: m.createdAt.toISOString(),
  }));
}

/** Supprime un média : détache les références puis supprime la ligne + le blob. */
export async function deleteMedia(id: string): Promise<void> {
  await assertAdmin();
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return;

  await prisma.$transaction([
    prisma.hero.updateMany({
      where: { heroImageId: id },
      data: { heroImageId: null },
    }),
    prisma.profile.updateMany({
      where: { imageId: id },
      data: { imageId: null },
    }),
    prisma.project.updateMany({
      where: { primaryImageId: id },
      data: { primaryImageId: null },
    }),
    prisma.siteSettings.updateMany({
      where: { publishedResumeId: id },
      data: { publishedResumeId: null },
    }),
    prisma.projectImage.deleteMany({ where: { mediaId: id } }),
    prisma.media.delete({ where: { id } }),
  ]);

  await deleteBlob(media.pathname ?? media.url);
  await audit("media.delete", "Media", id);
  await revalidateContent(
    ["projects", "hero", "profile", "settings"],
    ["/", "/projects"],
  );
}

/** Définit (ou retire) le CV publié utilisé automatiquement côté public. */
export async function setPublishedResume(
  mediaId: string | null,
): Promise<void> {
  await assertAdmin();
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", publishedResumeId: mediaId },
    update: { publishedResumeId: mediaId },
  });
  await audit("settings.publishedResume", "SiteSettings", mediaId ?? "none");
  await revalidateContent(["settings", "hero"], ["/"]);
}
