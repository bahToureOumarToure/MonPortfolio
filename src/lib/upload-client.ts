"use client";
import { upload } from "@vercel/blob/client";
import { registerMedia } from "@/lib/actions/media";
import type { MediaDTO } from "@/lib/media-dto";

/** Coupe un upload qui ne progresse plus (évite le spinner infini). */
const INACTIVITY_TIMEOUT_MS = 45_000;
/** Au-delà de cette taille, on passe en upload multipart (parallèle + reprise). */
const MULTIPART_THRESHOLD = 5 * 1024 * 1024;
const MB = 1024 * 1024;

export const UPLOAD_RULES = {
  IMAGE: {
    types: ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"],
    accept: "image/png,image/jpeg,image/webp,image/gif,image/avif",
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

/** Optimisation : les grandes photos sont redimensionnées et converties en WebP. */
const MAX_DIMENSION = 2560;
const COMPRESS_ABOVE_BYTES = 1.5 * MB;

export type UploadKind = keyof typeof UPLOAD_RULES;

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < MB) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / MB).toFixed(1).replace(".", ",")} Mo`;
}

/** Vérifie type et taille avant tout envoi réseau. Renvoie un message ou null. */
export function validateFile(file: File, kind: UploadKind): string | null {
  const rule = UPLOAD_RULES[kind];
  if (!(rule.types as readonly string[]).includes(file.type)) {
    return `« ${file.name} » : format non accepté (${rule.label}).`;
  }
  return null;
}

async function readDimensions(
  file: File,
): Promise<{ width?: number; height?: number }> {
  if (!file.type.startsWith("image/")) return {};
  try {
    const bitmap = await createImageBitmap(file);
    const dims = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return dims;
  } catch {
    return {};
  }
}

/**
 * Redimensionne (max 2560 px) et convertit en WebP les images lourdes.
 * Les GIF (animés) sont laissés intacts. Renvoie le fichier d'origine si
 * l'optimisation n'apporte rien ou échoue.
 */
export async function optimizeImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file;
  }
  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
  );
  if (scale === 1 && file.size <= COMPRESS_ABOVE_BYTES) {
    bitmap.close();
    return file;
  }
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.85),
  );
  if (!blob || blob.type !== "image/webp" || blob.size >= file.size)
    return file;
  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], name, {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

/**
 * Upload d'un fichier vers Vercel Blob (côté client, sans limite 4,5 Mo),
 * puis enregistrement de la ligne Media côté serveur (avec dimensions).
 */
export async function uploadFile(
  original: File,
  kind: UploadKind,
  onProgress?: (p: UploadProgress) => void,
): Promise<MediaDTO> {
  const invalid = validateFile(original, kind);
  if (invalid) throw new Error(invalid);

  const file = kind === "IMAGE" ? await optimizeImage(original) : original;
  const rule = UPLOAD_RULES[kind];
  if (file.size > rule.maxBytes) {
    throw new Error(
      `« ${original.name} » est trop lourd (${formatBytes(file.size)}, max ${formatBytes(rule.maxBytes)}).`,
    );
  }
  const dims = await readDimensions(file);

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
    armWatchdog(); // couvre aussi un blocage sur l'obtention du jeton
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

  const res = await registerMedia({
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
  if (!res.ok) throw new Error(res.error);
  return res.data;
}
