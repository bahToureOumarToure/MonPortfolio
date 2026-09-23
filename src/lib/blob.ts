import "server-only";
import { del } from "@vercel/blob";

/** Supprime un fichier du store Vercel Blob (best-effort). */
export async function deleteBlob(pathnameOrUrl: string): Promise<void> {
  if (!pathnameOrUrl) return;
  try {
    await del(pathnameOrUrl);
  } catch {
    // Fichier déjà absent ou store indisponible : on n'échoue pas l'opération.
  }
}
