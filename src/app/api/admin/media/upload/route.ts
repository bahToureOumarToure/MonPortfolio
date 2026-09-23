import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSessionUser } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const DOC_TYPES = ["application/pdf"];
const MB = 1024 * 1024;

// Autorise l'upload client Vercel Blob : contrôle admin + restriction
// type/taille imposée côté serveur (Blob refuse tout ce qui n'est pas listé).
export async function POST(request: Request): Promise<NextResponse> {
  // Sans jeton Blob côté serveur, la génération du token client échoue. On le
  // signale immédiatement et clairement plutôt que de laisser le SDK réessayer
  // (ce qui donne un « chargement » interminable côté navigateur).
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Stockage indisponible : BLOB_READ_WRITE_TOKEN n'est pas défini sur le serveur. Ajoute cette variable d'environnement (locale et/ou Production Vercel).",
      },
      { status: 503 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const user = await getSessionUser();
        if (!user) throw new Error("unauthorized");

        const isDoc = clientPayload === "DOCUMENT";
        return {
          allowedContentTypes: isDoc ? DOC_TYPES : IMAGE_TYPES,
          maximumSizeInBytes: isDoc ? 10 * MB : 5 * MB,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId: user.id }),
        };
      },
      // Ne fait rien ici : le webhook Blob ne joint pas localhost.
      // La ligne Media est créée côté client via l'action registerMedia.
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "upload refusé" },
      { status: 400 },
    );
  }
}
