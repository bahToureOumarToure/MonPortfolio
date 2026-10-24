"use client";
import { useCallback, useState } from "react";
import type { MediaDTO } from "@/lib/media-dto";
import { uploadFile, type UploadKind } from "@/lib/upload-client";

export interface UploadItem {
  key: string;
  name: string;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
}

/**
 * File d'upload : envoie les fichiers un par un, suit la progression de
 * chacun et conserve les erreurs (un fichier en échec ne bloque pas les autres).
 */
export function useUploader(kind: UploadKind) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const busy = items.some((i) => i.status === "uploading");

  const patch = (key: string, data: Partial<UploadItem>) =>
    setItems((list) =>
      list.map((i) => (i.key === key ? { ...i, ...data } : i)),
    );

  const uploadAll = useCallback(
    async (
      files: File[],
      onUploaded?: (media: MediaDTO) => void,
    ): Promise<MediaDTO[]> => {
      const queued = files.map((f, i) => ({
        file: f,
        key: `${Date.now()}-${i}-${f.name}`,
      }));
      setItems((list) => [
        ...list.filter((i) => i.status === "uploading"),
        ...queued.map(({ file, key }) => ({
          key,
          name: file.name,
          progress: 0,
          status: "uploading" as const,
        })),
      ]);

      const done: MediaDTO[] = [];
      for (const { file, key } of queued) {
        try {
          const media = await uploadFile(file, kind, (p) =>
            patch(key, { progress: p.percentage }),
          );
          patch(key, { status: "done", progress: 100 });
          done.push(media);
          onUploaded?.(media);
        } catch (e) {
          patch(key, {
            status: "error",
            error: e instanceof Error ? e.message : "Échec de l'upload.",
          });
        }
      }
      // Les réussites disparaissent après un court délai, les erreurs restent visibles.
      window.setTimeout(
        () => setItems((list) => list.filter((i) => i.status !== "done")),
        2500,
      );
      return done;
    },
    [kind],
  );

  const clearErrors = () =>
    setItems((list) => list.filter((i) => i.status !== "error"));

  return { items, busy, uploadAll, clearErrors };
}
