import "server-only";
import { del, list } from "@vercel/blob";
import {
  SERVER_UPLOAD_MAX_BYTES,
  type StorageMode,
  type StorageStatus,
} from "./upload-rules";

/**
 * Mode de stockage disponible :
 * - "client" : BLOB_READ_WRITE_TOKEN présent → upload direct navigateur → Blob
 *   (gros fichiers, progression) ;
 * - "server" : store relié par OIDC (BLOB_STORE_ID, sans jeton lecture/écriture)
 *   → upload via une route serveur (≤ 4 Mo) ;
 * - "none"   : aucun stockage relié au projet.
 */
export function blobMode(): StorageMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "client";
  if (process.env.BLOB_STORE_ID) return "server";
  return "none";
}

/** Vérifie réellement l'accès au store (requête légère). */
export async function blobStatus(): Promise<StorageStatus> {
  const mode = blobMode();
  const base = { mode, serverMaxBytes: SERVER_UPLOAD_MAX_BYTES };
  if (mode === "none") return { ...base, ok: false, error: null };
  try {
    await list({ limit: 1 });
    return { ...base, ok: true, error: null };
  } catch (error) {
    return {
      ...base,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function isBlobUrl(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

/** Supprime un fichier du store Vercel Blob (best-effort). */
export async function deleteBlob(pathnameOrUrl: string): Promise<void> {
  if (!pathnameOrUrl) return;
  try {
    await del(pathnameOrUrl);
  } catch {
    // Fichier déjà absent ou store indisponible : on n'échoue pas l'opération.
  }
}
