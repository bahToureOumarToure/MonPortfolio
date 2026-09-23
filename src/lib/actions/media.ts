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
  width: number | null;
  height: number | null;
  createdAt: string;
}

export interface AssignTarget {
  id: string;
  legacyId: number | null;
  name: string;
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
      width: d.width ?? null,
      height: d.height ?? null,
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
    width: media.width,
    height: media.height,
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
    width: m.width,
    height: m.height,
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

/** Projets disponibles comme cibles d'assignation d'image. */
export async function listAssignTargets(): Promise<AssignTarget[]> {
  await assertAdmin();
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    select: { id: true, legacyId: true, name: true },
  });
  return projects;
}

/**
 * Assigne une image existante directement à un emplacement du site :
 * "profile", "hero", ou "project:<id>". Effet immédiat côté public.
 */
export async function assignMedia(
  mediaId: string,
  target: string,
): Promise<void> {
  await assertAdmin();
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media || media.kind !== "IMAGE") {
    throw new Error("Média introuvable ou non image.");
  }

  if (target === "profile") {
    await prisma.profile.updateMany({
      where: { id: "singleton" },
      data: { imageId: mediaId },
    });
    await audit("media.assign.profile", "Media", mediaId);
    await revalidateContent(["profile"], ["/"]);
    return;
  }

  if (target === "hero") {
    await prisma.hero.updateMany({
      where: { id: "singleton" },
      data: { heroImageId: mediaId },
    });
    await audit("media.assign.hero", "Media", mediaId);
    await revalidateContent(["hero"], ["/"]);
    return;
  }

  if (target.startsWith("project:")) {
    const projectId = target.slice("project:".length);
    const project = await prisma.project.update({
      where: { id: projectId },
      data: { primaryImageId: mediaId },
    });
    // Garantit la présence de l'image dans la galerie du projet.
    const exists = await prisma.projectImage.findFirst({
      where: { projectId, mediaId },
    });
    if (!exists) {
      await prisma.projectImage.create({
        data: { projectId, mediaId, order: 0 },
      });
    }
    await audit("media.assign.project", "Project", projectId);
    await revalidateContent(
      ["projects"],
      ["/", "/projects", `/projects/${project.legacyId}`],
    );
    return;
  }

  throw new Error("Cible d'assignation invalide.");
}
