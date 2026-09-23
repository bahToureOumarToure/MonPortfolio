"use client";
import { upload } from "@vercel/blob/client";
import { registerMedia, type MediaDTO } from "@/lib/actions/media";

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
 */
export async function uploadFile(
  file: File,
  kind: "IMAGE" | "DOCUMENT",
): Promise<MediaDTO> {
  const dims = await readImageDimensions(file);
  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/admin/media/upload",
    clientPayload: kind,
  });
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
