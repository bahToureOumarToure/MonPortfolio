import "server-only";
import { list, put } from "@vercel/blob";
import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { blobMode, deleteBlob, isBlobUrl } from "./blob";
import {
  SERVER_UPLOAD_MAX_BYTES,
  type StorageStatus,
  type UploadKind,
} from "./upload-rules";

// Stockage des fichiers envoyés depuis l'admin.
// 1. Vercel Blob quand un store est relié au projet et répond.
// 2. Sinon — store absent, privé, jeton invalide… — la base de données
//    (table MediaBlob), servie par /media/<id>/<nom>. Aucune configuration
//    n'est nécessaire : un upload aboutit toujours.

const DB_PREFIX = "db:";
/** Plafond du stockage de secours (la base n'est pas faite pour de gros volumes). */
const DB_TOTAL_MAX_BYTES = 200 * 1024 * 1024;
const BLOB_PUT_TIMEOUT_MS = 15_000;
const BLOB_CHECK_TIMEOUT_MS = 6_000;
/** Après un échec, Vercel Blob n'est plus sollicité pendant ce délai. */
const BLOB_RETRY_AFTER_MS = 5 * 60_000;

// Dernier échec de Vercel Blob sur cette instance : évite d'attendre le délai
// de garde à chaque fichier quand le store est en panne.
let blobDown: { until: number; error: string } | null = null;

function markBlobDown(error: string) {
  blobDown = { until: Date.now() + BLOB_RETRY_AFTER_MS, error };
}

const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

/** Erreur dont le message peut être montré tel quel dans l'admin. */
export class StorageError extends Error {}

// Même DDL que prisma/sql/010_media_blob.sql : si la migration n'a pas encore
// tourné sur cette base, la table est créée au premier besoin.
const MEDIA_BLOB_DDL = `CREATE TABLE IF NOT EXISTS "MediaBlob" (
    "id" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MediaBlob_pkey" PRIMARY KEY ("id")
)`;

async function withMediaBlobTable<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const missingTable =
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2021";
    if (!missingTable) throw error;
    await prisma.$executeRawUnsafe(MEDIA_BLOB_DDL);
    return fn();
  }
}

const message = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

/**
 * Borne la durée d'un appel à Vercel Blob. Le SDK réessaie longtemps quand le
 * service est injoignable, sans tenir compte d'un signal d'annulation : sans
 * cette limite, un store en panne bloquerait l'upload au lieu de laisser le
 * fichier partir dans le stockage intégré.
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Vercel Blob ne répond pas (${ms / 1000} s).`)),
      ms,
    );
  });
  // L'appel d'origine peut encore échouer plus tard : ne pas le laisser en
  // rejet non géré.
  promise.catch(() => {});
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/** Nom de fichier sûr pour une URL, avec l'extension correspondant au type. */
function safeFilename(filename: string, mimeType: string): string {
  const ext = EXT_BY_MIME[mimeType] ?? "bin";
  const base =
    filename
      .replace(/\.[^.]+$/, "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "fichier";
  return `${base}.${ext}`;
}

export interface StoredFile {
  url: string;
  pathname: string;
  storage: "blob" | "database";
  /** Raison pour laquelle Vercel Blob n'a pas été utilisé, s'il est relié. */
  blobError: string | null;
}

/** Enregistre un fichier : Vercel Blob si possible, sinon la base de données. */
export async function storeFile(input: {
  data: Uint8Array<ArrayBuffer>;
  mimeType: string;
  filename: string;
  kind: UploadKind;
}): Promise<StoredFile> {
  const name = safeFilename(input.filename, input.mimeType);
  let blobError: string | null = null;

  if (blobDown && Date.now() < blobDown.until) {
    blobError = blobDown.error;
  } else if (blobMode() !== "none") {
    try {
      const blob = await withTimeout(
        put(
          `${input.kind === "DOCUMENT" ? "documents" : "images"}/${name}`,
          Buffer.from(input.data),
          {
            access: "public",
            addRandomSuffix: true,
            contentType: input.mimeType,
          },
        ),
        BLOB_PUT_TIMEOUT_MS,
      );
      blobDown = null;
      return {
        url: blob.url,
        pathname: blob.pathname,
        storage: "blob",
        blobError: null,
      };
    } catch (error) {
      blobError = message(error);
      markBlobDown(blobError);
    }
  }

  const size = input.data.byteLength;
  if (size > SERVER_UPLOAD_MAX_BYTES) {
    throw new StorageError(
      "Fichier trop lourd : 4 Mo maximum tant qu'aucun stockage Vercel Blob n'est relié au site.",
    );
  }
  const used = await withMediaBlobTable(() =>
    prisma.mediaBlob.aggregate({ _sum: { size: true } }),
  );
  if ((used._sum.size ?? 0) + size > DB_TOTAL_MAX_BYTES) {
    throw new StorageError(
      "L'espace de stockage intégré au site est plein (200 Mo). Supprime des fichiers inutilisés dans Médias, ou relie un store Vercel Blob au projet.",
    );
  }
  const row = await prisma.mediaBlob.create({
    data: { data: input.data, mimeType: input.mimeType, size },
    select: { id: true },
  });
  return {
    url: `/media/${row.id}/${name}`,
    pathname: `${DB_PREFIX}${row.id}`,
    storage: "database",
    blobError,
  };
}

/** Supprime le fichier d'un média, où qu'il soit stocké (best-effort). */
export async function removeStoredFile(media: {
  url: string;
  pathname: string | null;
}): Promise<void> {
  if (media.pathname?.startsWith(DB_PREFIX)) {
    const id = media.pathname.slice(DB_PREFIX.length);
    await prisma.mediaBlob.deleteMany({ where: { id } }).catch(() => {});
    return;
  }
  // Les fichiers /public historiques ne sont stockés nulle part : rien à faire.
  if (media.pathname || isBlobUrl(media.url)) {
    await deleteBlob(media.pathname ?? media.url);
  }
}

/** Contenu d'un fichier du stockage de secours (route publique /media). */
export async function readStoredFile(
  id: string,
): Promise<{ data: Uint8Array; mimeType: string } | null> {
  try {
    return await prisma.mediaBlob.findUnique({
      where: { id },
      select: { data: true, mimeType: true },
    });
  } catch {
    return null;
  }
}

/** État réel du stockage, affiché dans l'admin. */
export async function storageStatus(): Promise<StorageStatus> {
  const mode = blobMode();
  const base = { serverMaxBytes: SERVER_UPLOAD_MAX_BYTES };
  let blobError: string | null = null;

  if (mode !== "none") {
    try {
      await withTimeout(list({ limit: 1 }), BLOB_CHECK_TIMEOUT_MS);
      blobDown = null;
      return { ...base, mode, ok: true, error: null, blobError: null };
    } catch (error) {
      blobError = message(error);
      markBlobDown(blobError);
    }
  }

  try {
    await withMediaBlobTable(() => prisma.mediaBlob.count());
    return { ...base, mode: "database", ok: true, error: null, blobError };
  } catch (error) {
    return {
      ...base,
      mode: "database",
      ok: false,
      error: message(error),
      blobError,
    };
  }
}
