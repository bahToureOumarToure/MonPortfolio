import "server-only";
import { del } from "@vercel/blob";

/**
 * Store Vercel Blob relié au projet :
 * - "client" : BLOB_READ_WRITE_TOKEN présent → upload direct navigateur → Blob
 *   (gros fichiers, progression) ;
 * - "server" : store relié par OIDC (BLOB_STORE_ID, sans jeton lecture/écriture)
 *   → upload via une route serveur (≤ 4 Mo) ;
 * - "none"   : aucun store relié (les fichiers vont dans la base, voir
 *   src/lib/storage.ts).
 */
export function blobMode(): "client" | "server" | "none" {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "client";
  if (process.env.BLOB_STORE_ID) return "server";
  return "none";
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
