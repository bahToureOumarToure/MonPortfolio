import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSessionUser } from "@/lib/auth/session";
import { UPLOAD_RULES } from "@/lib/upload-rules";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
          "Upload direct indisponible : BLOB_READ_WRITE_TOKEN n'est pas défini sur le serveur.",
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

        const rule =
          UPLOAD_RULES[clientPayload === "DOCUMENT" ? "DOCUMENT" : "IMAGE"];
        return {
          allowedContentTypes: [...rule.types],
          maximumSizeInBytes: rule.maxBytes,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId: user.id }),
        };
      },
      // Pas de webhook de fin d'upload : la ligne Media est créée côté client
      // via l'action registerMedia (un webhook serait de toute façon bloqué
      // par le middleware admin, faute de cookie de session).
    });
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "upload refusé" },
      { status: 400 },
    );
  }
}
