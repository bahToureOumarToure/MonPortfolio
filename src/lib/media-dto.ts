import type { Media } from "@prisma/client";

// Formes sérialisables des médias, partagées serveur/client.
export interface MediaDTO {
  id: string;
  url: string;
  filename: string;
  alt: string | null;
  kind: "IMAGE" | "DOCUMENT";
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  createdAt: string;
  /** Nombre d'emplacements du site qui utilisent ce média (-1 = inconnu). */
  usage: number;
}

export interface AssignTarget {
  id: string;
  legacyId: number | null;
  name: string;
}

export function toMediaDTO(m: Media, usage = -1): MediaDTO {
  return {
    id: m.id,
    url: m.url,
    filename: m.filename,
    alt: m.alt,
    kind: m.kind,
    mimeType: m.mimeType,
    size: m.size,
    width: m.width,
    height: m.height,
    createdAt: m.createdAt.toISOString(),
    usage,
  };
}
