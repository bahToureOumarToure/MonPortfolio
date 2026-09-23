"use client";
import { upload } from "@vercel/blob/client";
import { registerMedia, type MediaDTO } from "@/lib/actions/media";

/** Coupe un upload qui ne progresse plus (évite le spinner infini). */
const INACTIVITY_TIMEOUT_MS = 45_000;
/** Au-delà de cette taille, on passe en upload multipart (parallèle + reprise). */
const MULTIPART_THRESHOLD = 5 * 1024 * 1024;

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/** Lit les dimensions naturelles d'une image côté navigateur. */
function readImageDimensions(
  file: File,
): Promise<{ width?: number; height?: number }> {
  if (!file.type.startsWith("image/")) return Promise.resolve({});
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({});
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

/**
 * Upload d'un fichier vers Vercel Blob (côté client, sans limite 4,5 Mo),
 * puis enregistrement de la ligne Media côté serveur (avec dimensions).
 *
 * - `onProgress` : progression du transfert (0→100) pour l'UI.
 * - Un garde-fou coupe l'upload s'il ne progresse plus (plus de spinner infini)
 *   et remonte un message d'erreur clair.
 */
export async function uploadFile(
  file: File,
  kind: "IMAGE" | "DOCUMENT",
  onProgress?: (p: UploadProgress) => void,
): Promise<MediaDTO> {
  const dims = await readImageDimensions(file);

  const controller = new AbortController();
  let timedOut = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const armWatchdog = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, INACTIVITY_TIMEOUT_MS);
  };

  let blob: Awaited<ReturnType<typeof upload>>;
  try {
    armWatchdog(); // démarre avant l'appel : couvre aussi un blocage sur le token
    blob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/admin/media/upload",
      clientPayload: kind,
      multipart: file.size > MULTIPART_THRESHOLD,
      abortSignal: controller.signal,
      onUploadProgress: (e) => {
        armWatchdog();
        onProgress?.({
          loaded: e.loaded,
          total: e.total,
          percentage: e.percentage,
        });
      },
    });
  } catch (err) {
    if (timedOut) {
      throw new Error(
        "L'upload a expiré (aucune progression). Vérifie ta connexion et que le stockage est configuré (BLOB_READ_WRITE_TOKEN).",
      );
    }
    throw new Error(
      err instanceof Error && err.message ? err.message : "Échec de l'upload.",
    );
  } finally {
    if (timer) clearTimeout(timer);
  }

  return registerMedia({
    url: blob.url,
    pathname: blob.pathname,
    filename: file.name,
    mimeType:
      file.type || (kind === "DOCUMENT" ? "application/pdf" : "image/*"),
    size: file.size,
    width: dims.width,
    height: dims.height,
    kind,
  });
}
