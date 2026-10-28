import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { blobStatus } from "@/lib/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** État du stockage des fichiers (diagnostic affiché dans l'admin). */
export async function GET(): Promise<NextResponse> {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "Session expirée : reconnecte-toi." },
      { status: 401 },
    );
  }
  return NextResponse.json(await blobStatus(), {
    headers: { "Cache-Control": "no-store" },
  });
}
