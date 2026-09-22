"use client";
import { upload } from "@vercel/blob/client";
import { registerMedia, type MediaDTO } from "@/lib/actions/media";

/**
 * Upload d'un fichier vers Vercel Blob (côté client, sans limite 4,5 Mo),
 * puis enregistrement de la ligne Media côté serveur.
 */
export async function uploadFile(
  file: File,
  kind: "IMAGE" | "DOCUMENT",
): Promise<MediaDTO> {
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
    kind,
  });
}
