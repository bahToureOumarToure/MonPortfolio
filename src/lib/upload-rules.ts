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

/**
 * Où vont les fichiers envoyés :
 * - "client"   : Vercel Blob, upload direct depuis le navigateur ;
 * - "server"   : Vercel Blob, upload via le serveur (≤ 4 Mo) ;
 * - "database" : stockage intégré au site (base de données, ≤ 4 Mo), utilisé
 *   quand aucun store Vercel Blob n'est relié ou qu'il ne répond pas.
 */
export type StorageMode = "client" | "server" | "database";

export interface StorageStatus {
  mode: StorageMode;
  ok: boolean;
  /** Erreur du stockage utilisé (aucun upload possible si non nul). */
  error: string | null;
  /** Vercel Blob est relié mais inutilisable : raison technique. */
  blobError: string | null;
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
