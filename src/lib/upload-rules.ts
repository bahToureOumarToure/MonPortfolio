// Règles d'upload partagées navigateur / serveur (aucune dépendance).
const MB = 1024 * 1024;

export const UPLOAD_RULES = {
  IMAGE: {
    types: ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"],
    accept:
      "image/png,image/jpeg,image/webp,image/gif,image/avif,image/heic,image/heif",
    maxBytes: 5 * MB,
    label: "PNG, JPG, WebP, GIF ou AVIF",
  },
  DOCUMENT: {
    types: ["application/pdf"],
    accept: "application/pdf",
    maxBytes: 10 * MB,
    label: "PDF",
  },
} as const;

export type UploadKind = keyof typeof UPLOAD_RULES;

/** Limite des fonctions Vercel (corps de requête ≈ 4,5 Mo) pour l'upload via le serveur. */
export const SERVER_UPLOAD_MAX_BYTES = 4 * MB;

/** Mode d'upload disponible côté serveur. */
export type StorageMode = "client" | "server" | "none";

export interface StorageStatus {
  mode: StorageMode;
  ok: boolean;
  error: string | null;
  serverMaxBytes: number;
}

const MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  heic: "image/heic",
  heif: "image/heif",
  pdf: "application/pdf",
};

/** Type MIME d'un fichier, déduit de l'extension si le navigateur ne le fournit pas. */
export function mimeOf(file: { name: string; type: string }): string {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return MIME_BY_EXT[ext] ?? "";
}
