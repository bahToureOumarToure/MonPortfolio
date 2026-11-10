import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { storageStatus } from "@/lib/storage";

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
  return NextResponse.json(await storageStatus(), {
    headers: { "Cache-Control": "no-store" },
  });
}
