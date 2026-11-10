"use client";
import { upload } from "@vercel/blob/client";
import { registerMedia } from "@/lib/actions/media";
import type { MediaDTO } from "@/lib/media-dto";
import {
  UPLOAD_RULES,
  mimeOf,
  type StorageStatus,
  type UploadKind,
} from "@/lib/upload-rules";

export { UPLOAD_RULES, type UploadKind };

/** Coupe un upload qui ne progresse plus (évite le spinner infini). */
const INACTIVITY_TIMEOUT_MS = 45_000;
/** Au-delà de cette taille, on passe en upload multipart (parallèle + reprise). */
const MULTIPART_THRESHOLD = 5 * 1024 * 1024;
const MB = 1024 * 1024;

/** Optimisation : les grandes photos sont redimensionnées et converties en WebP. */
const MAX_DIMENSION = 2560;
const COMPRESS_ABOVE_BYTES = 1.5 * MB;

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

const STORAGE_DOWN =
  "Le stockage des fichiers est injoignable pour le moment. Réessaie dans un instant.";

/**
 * Passe à true quand l'upload direct vers Vercel Blob a échoué une fois sur
 * cette page : les fichiers suivants passent tout de suite par le serveur.
 */
let directBroken = false;

let statusPromise: Promise<StorageStatus> | null = null;

/** État du stockage (mis en cache pour la session de la page). */
export function getStorageStatus(force = false): Promise<StorageStatus> {
  if (!statusPromise || force) {
    statusPromise = fetch("/api/admin/media/status", { cache: "no-store" })
      .then(async (res) => {
        if (res.status === 401)
          throw new Error("Session expirée : reconnecte-toi pour continuer.");
        if (!res.ok)
          throw new Error("Impossible de vérifier le stockage des fichiers.");
        return (await res.json()) as StorageStatus;
      })
      .catch((error) => {
        statusPromise = null; // on réessaiera au prochain upload
        throw error;
      });
  }
  return statusPromise;
}

/** Vérifie le type avant tout envoi réseau. Renvoie un message ou null. */
export function validateFile(file: File, kind: UploadKind): string | null {
  const rule = UPLOAD_RULES[kind];
  const type = mimeOf(file);
  const convertible = kind === "IMAGE" && /^image\/hei[cf]$/.test(type);
  if (!(rule.types as readonly string[]).includes(type) && !convertible) {
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
 * Redimensionne (max 2560 px) et convertit en WebP les images lourdes ou dans
 * un format non accepté (ex. HEIC des iPhone). Les GIF (animés) restent intacts.
 */
export async function optimizeImage(file: File): Promise<File> {
  const type = mimeOf(file);
  if (!type.startsWith("image/") || type === "image/gif") return file;
  const mustConvert = !(UPLOAD_RULES.IMAGE.types as readonly string[]).includes(
    type,
  );

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    if (mustConvert) {
      throw new Error(
        `« ${file.name} » : ce navigateur ne sait pas lire ce format. Exporte la photo en JPG ou PNG puis réessaie.`,
      );
    }
    return file;
  }
  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
  );
  if (!mustConvert && scale === 1 && file.size <= COMPRESS_ABOVE_BYTES) {
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
  const toBlob = (format: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, format, 0.85));
  let blob = await toBlob("image/webp");
  if (!blob || blob.type !== "image/webp") blob = await toBlob("image/jpeg");
  if (!blob || (!mustConvert && blob.size >= file.size)) return file;
  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  const name = file.name.replace(/\.[^.]+$/, "") + `.${ext}`;
  return new File([blob], name, { type: blob.type, lastModified: Date.now() });
}

/**
 * Upload via le serveur, avec progression. Le serveur choisit le stockage
 * (Vercel Blob ou stockage intégré au site) et crée lui-même le média.
 */
function uploadThroughServer(
  file: File,
  kind: UploadKind,
  dims: { width?: number; height?: number },
  onProgress?: (p: UploadProgress) => void,
): Promise<MediaDTO> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/media/put");
    xhr.timeout = 120_000;
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress?.({
          loaded: e.loaded,
          total: e.total,
          percentage: (e.loaded / e.total) * 100,
        });
      }
    };
    xhr.onload = () => {
      let data: { media?: MediaDTO; error?: string } = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        /* réponse non JSON */
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.media) {
        resolve(data.media);
      } else if (xhr.status === 413) {
        reject(new Error(data.error ?? "Fichier trop lourd (4 Mo maximum)."));
      } else {
        reject(
          new Error(
            data.error ??
              `Le serveur a refusé le fichier (erreur ${xhr.status}).`,
          ),
        );
      }
    };
    xhr.onerror = () =>
      reject(new Error("Connexion interrompue pendant l'envoi."));
    xhr.ontimeout = () =>
      reject(new Error("L'envoi a expiré. Vérifie ta connexion et réessaie."));
    const form = new FormData();
    form.append("file", file);
    form.append("kind", kind);
    if (dims.width) form.append("width", String(dims.width));
    if (dims.height) form.append("height", String(dims.height));
    xhr.send(form);
  });
}

/** Upload direct navigateur → Vercel Blob (jeton client), sans limite 4,5 Mo. */
async function uploadDirect(
  file: File,
  kind: UploadKind,
  onProgress?: (p: UploadProgress) => void,
): Promise<{ url: string; pathname: string }> {
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

  try {
    armWatchdog(); // couvre aussi un blocage sur l'obtention du jeton
    const blob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/admin/media/upload",
      clientPayload: kind,
      contentType: file.type,
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
    return { url: blob.url, pathname: blob.pathname };
  } catch (err) {
    if (timedOut) {
      throw new Error(
        "L'upload a expiré (aucune progression). Vérifie ta connexion et réessaie.",
      );
    }
    const message = err instanceof Error ? err.message : "";
    if (/client token/i.test(message)) {
      throw new Error(
        "Le serveur a refusé l'envoi : session expirée ou stockage mal configuré.",
      );
    }
    throw new Error(
      message.replace(/^Vercel Blob:\s*/, "") || "Échec de l'upload.",
    );
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Envoie un fichier et crée son média. Avec un store Vercel Blob relié par
 * jeton, l'upload part directement du navigateur (gros fichiers) ; dans tous
 * les autres cas — et si l'upload direct échoue — il passe par le serveur, qui
 * enregistre le fichier dans Vercel Blob ou, à défaut, dans le stockage
 * intégré au site. Renvoie toujours un message d'erreur compréhensible.
 */
export async function uploadFile(
  original: File,
  kind: UploadKind,
  onProgress?: (p: UploadProgress) => void,
): Promise<MediaDTO> {
  const invalid = validateFile(original, kind);
  if (invalid) throw new Error(invalid);

  const status = await getStorageStatus();
  if (!status.ok) throw new Error(STORAGE_DOWN);

  const file = kind === "IMAGE" ? await optimizeImage(original) : original;
  const rule = UPLOAD_RULES[kind];
  const serverLimit = Math.min(rule.maxBytes, status.serverMaxBytes);
  const tooBig = (limit: number) =>
    new Error(
      `« ${original.name} » est trop lourd (${formatBytes(file.size)}, max ${formatBytes(limit)}).`,
    );
  const dims = await readDimensions(file);

  if (status.mode === "client" && !directBroken) {
    if (file.size > rule.maxBytes) throw tooBig(rule.maxBytes);
    try {
      const stored = await uploadDirect(file, kind, onProgress);
      const res = await registerMedia({
        url: stored.url,
        pathname: stored.pathname,
        filename: file.name,
        mimeType:
          mimeOf(file) || (kind === "DOCUMENT" ? "application/pdf" : "image/*"),
        size: file.size,
        width: dims.width,
        height: dims.height,
        kind,
      });
      if (!res.ok) throw new Error(res.error);
      return res.data;
    } catch (error) {
      // Trop lourd pour passer par le serveur : on remonte l'erreur d'origine.
      if (file.size > serverLimit) throw error;
      directBroken = true;
    }
  }

  if (file.size > serverLimit) throw tooBig(serverLimit);
  return uploadThroughServer(file, kind, dims, onProgress);
}
