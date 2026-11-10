import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/auth/origin";
import { prisma } from "@/lib/db";
import { toMediaDTO } from "@/lib/media-dto";
import { StorageError, storeFile } from "@/lib/storage";
import {
  SERVER_UPLOAD_MAX_BYTES,
  UPLOAD_RULES,
  mimeOf,
  type UploadKind,
} from "@/lib/upload-rules";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function dimension(value: FormDataEntryValue | null): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 && n < 100_000 ? n : null;
}

/**
 * Upload via le serveur (≤ 4 Mo) : enregistre le fichier — Vercel Blob si un
 * store est utilisable, sinon la base de données — puis crée la ligne Media.
 * C'est la voie qui fonctionne toujours, même sans aucun stockage configuré.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!isSameOrigin(request)) return fail("Origine invalide.", 403);
  const user = await getSessionUser();
  if (!user) return fail("Session expirée : reconnecte-toi.", 401);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("Fichier trop lourd ou requête invalide (4 Mo maximum).", 413);
  }
  const file = form.get("file");
  const kind =
    form.get("kind") === "DOCUMENT" ? "DOCUMENT" : ("IMAGE" as UploadKind);
  if (!(file instanceof File)) return fail("Aucun fichier reçu.", 400);

  const rule = UPLOAD_RULES[kind];
  const type = mimeOf(file);
  if (!(rule.types as readonly string[]).includes(type)) {
    return fail(`Format non accepté (${rule.label}).`, 415);
  }
  if (file.size === 0) return fail("Ce fichier est vide.", 400);
  if (file.size > Math.min(rule.maxBytes, SERVER_UPLOAD_MAX_BYTES)) {
    return fail("Fichier trop lourd (4 Mo maximum).", 413);
  }

  try {
    const stored = await storeFile({
      data: new Uint8Array(await file.arrayBuffer()),
      mimeType: type,
      filename: file.name,
      kind,
    });
    const media = await prisma.media.create({
      data: {
        url: stored.url,
        pathname: stored.pathname,
        filename: file.name.slice(0, 255) || "fichier",
        mimeType: type,
        size: file.size,
        width: dimension(form.get("width")),
        height: dimension(form.get("height")),
        kind,
      },
    });
    await prisma.auditLog
      .create({
        data: { action: "media.create", entity: "Media", entityId: media.id },
      })
      .catch(() => {});
    return NextResponse.json({
      media: toMediaDTO(media, 0),
      storage: stored.storage,
    });
  } catch (error) {
    if (error instanceof StorageError) return fail(error.message, 507);
    console.error("[media/put]", error);
    return fail(
      "L'enregistrement du fichier a échoué (base de données injoignable ?). Réessaie dans un instant.",
      500,
    );
  }
}
