"use server";
import { prisma } from "@/lib/db";
import { mediaAltInput, registerMediaInput } from "@/lib/validation/media";
import { deleteBlob } from "@/lib/blob";
import {
  assertAdmin,
  audit,
  revalidateContent,
  run,
  UserFacingError,
} from "./common";
import type { ActionResult } from "./result";
import { toMediaDTO, type AssignTarget, type MediaDTO } from "@/lib/media-dto";

/** Crée la ligne Media après un upload Blob réussi (appelée côté client). */
export async function registerMedia(
  input: unknown,
): Promise<ActionResult<MediaDTO>> {
  return run(async () => {
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
    return toMediaDTO(media, 0);
  });
}

/** Liste les médias (médiathèque et sélecteur d'image). */
export async function listMedia(
  kind?: "IMAGE" | "DOCUMENT",
): Promise<ActionResult<MediaDTO[]>> {
  return run(async () => {
    await assertAdmin();
    const rows = await prisma.media.findMany({
      where: kind ? { kind } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return rows.map((m) => toMediaDTO(m));
  });
}

/** Met à jour le texte alternatif (accessibilité / SEO) d'un média. */
export async function updateMediaAlt(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    const { alt } = mediaAltInput.parse(input);
    await prisma.media.update({ where: { id }, data: { alt: alt || null } });
    await audit("media.alt", "Media", id);
    await revalidateContent(["projects", "hero", "profile"], ["/"]);
    return undefined;
  });
}

/** Supprime un média : détache les références puis supprime la ligne + le blob. */
export async function deleteMedia(id: string): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return undefined;

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

    // Les fichiers /public historiques ne sont pas sur Blob : rien à supprimer.
    if (media.pathname || media.url.startsWith("https://")) {
      await deleteBlob(media.pathname ?? media.url);
    }
    await audit("media.delete", "Media", id);
    await revalidateContent(
      ["projects", "hero", "profile", "settings"],
      ["/", "/projects"],
    );
    return undefined;
  });
}

/** Définit (ou retire) le CV publié utilisé automatiquement côté public. */
export async function setPublishedResume(
  mediaId: string | null,
): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    if (mediaId) {
      const media = await prisma.media.findUnique({ where: { id: mediaId } });
      if (!media || media.kind !== "DOCUMENT") {
        throw new UserFacingError("Ce fichier n'est pas un document PDF.");
      }
    }
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", publishedResumeId: mediaId },
      update: { publishedResumeId: mediaId },
    });
    await audit("settings.publishedResume", "SiteSettings", mediaId ?? "none");
    await revalidateContent(["settings", "hero"], ["/"]);
    return undefined;
  });
}

/** Projets disponibles comme cibles d'assignation d'image. */
export async function listAssignTargets(): Promise<
  ActionResult<AssignTarget[]>
> {
  return run(async () => {
    await assertAdmin();
    return prisma.project.findMany({
      orderBy: { order: "asc" },
      select: { id: true, legacyId: true, name: true },
    });
  });
}

/**
 * Assigne une image existante à un emplacement du site :
 * "profile", "hero", ou "project:<id>". Effet immédiat côté public.
 */
export async function assignMedia(
  mediaId: string,
  target: string,
): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    const media = await prisma.media.findUnique({ where: { id: mediaId } });
    if (!media || media.kind !== "IMAGE") {
      throw new UserFacingError("Média introuvable ou non image.");
    }

    if (target === "profile") {
      await prisma.profile.updateMany({
        where: { id: "singleton" },
        data: { imageId: mediaId },
      });
      await audit("media.assign.profile", "Media", mediaId);
      await revalidateContent(["profile"], ["/"]);
      return undefined;
    }

    if (target === "hero") {
      await prisma.hero.updateMany({
        where: { id: "singleton" },
        data: { heroImageId: mediaId },
      });
      await audit("media.assign.hero", "Media", mediaId);
      await revalidateContent(["hero"], ["/"]);
      return undefined;
    }

    if (target.startsWith("project:")) {
      const projectId = target.slice("project:".length);
      const project = await prisma.$transaction(async (tx) => {
        const p = await tx.project.update({
          where: { id: projectId },
          data: { primaryImageId: mediaId },
        });
        // L'image principale passe en tête de galerie.
        const images = await tx.projectImage.findMany({
          where: { projectId },
          orderBy: { order: "asc" },
        });
        await tx.projectImage.deleteMany({ where: { projectId } });
        const ordered = [
          mediaId,
          ...images.map((i) => i.mediaId).filter((m) => m !== mediaId),
        ];
        await tx.projectImage.createMany({
          data: ordered.map((m, order) => ({ projectId, mediaId: m, order })),
        });
        return p;
      });
      await audit("media.assign.project", "Project", projectId);
      await revalidateContent(
        ["projects"],
        ["/", "/projects", `/projects/${project.legacyId}`],
      );
      return undefined;
    }

    throw new UserFacingError("Cible d'assignation invalide.");
  });
}
