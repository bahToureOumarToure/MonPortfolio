import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSessionUser } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/auth/origin";
import { blobMode } from "@/lib/blob";
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

/**
 * Upload via le serveur, utilisé quand le store Blob est relié par OIDC
 * (pas de BLOB_READ_WRITE_TOKEN, donc pas d'upload direct navigateur).
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!isSameOrigin(request)) return fail("Origine invalide.", 403);
  const user = await getSessionUser();
  if (!user) return fail("Session expirée : reconnecte-toi.", 401);
  if (blobMode() === "none") {
    return fail("Aucun stockage Vercel Blob n'est relié à ce projet.", 503);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(
      "Fichier trop lourd ou requête invalide (4 Mo maximum par ce mode).",
      413,
    );
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
  if (file.size > Math.min(rule.maxBytes, SERVER_UPLOAD_MAX_BYTES)) {
    return fail(
      "Fichier trop lourd pour ce mode de stockage (4 Mo maximum).",
      413,
    );
  }

  const safeName = file.name.replace(/[^\w.-]+/g, "-").slice(-120) || "fichier";
  try {
    const blob = await put(
      `${kind === "DOCUMENT" ? "documents" : "images"}/${safeName}`,
      file,
      {
        access: "public",
        addRandomSuffix: true,
        contentType: type,
      },
    );
    return NextResponse.json({ url: blob.url, pathname: blob.pathname });
  } catch (error) {
    return fail(
      error instanceof Error
        ? error.message
        : "Le stockage a refusé le fichier.",
      502,
    );
  }
}
