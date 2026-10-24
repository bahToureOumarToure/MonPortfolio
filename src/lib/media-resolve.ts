import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "./db";

const MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  svg: "image/svg+xml",
};

function guessMime(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  return MIME_BY_EXT[ext] ?? "image/*";
}

/**
 * Renvoie l'id du média correspondant à une URL d'image, en créant la ligne
 * si besoin (URLs saisies à la main ou chemins /public historiques).
 */
export async function ensureImageMedia(
  url: string,
  db: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<string | null> {
  const u = url.trim();
  if (!u) return null;
  const existing = await db.media.findFirst({
    where: { url: u },
    select: { id: true },
  });
  if (existing) return existing.id;
  const media = await db.media.create({
    data: {
      url: u,
      filename: u.split("?")[0].split("/").filter(Boolean).pop() ?? "image",
      mimeType: guessMime(u),
      kind: "IMAGE",
    },
  });
  return media.id;
}
