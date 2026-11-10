import { readStoredFile } from "@/lib/storage";

export const runtime = "nodejs";

/**
 * Sert un fichier du stockage intégré au site (table MediaBlob) :
 * /media/<id>/<nom>. Public, comme les fichiers Vercel Blob. Un identifiant
 * ne change jamais de contenu : mise en cache longue (navigateur et CDN).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const file = /^[a-z0-9]{8,40}$/.test(id) ? await readStoredFile(id) : null;
  if (!file) {
    return new Response("Not found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }
  return new Response(Buffer.from(file.data), {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(file.data.byteLength),
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      // Seuls des images et des PDF sont acceptés à l'upload ; le navigateur
      // ne doit jamais interpréter le contenu autrement.
      "X-Content-Type-Options": "nosniff",
    },
  });
}
