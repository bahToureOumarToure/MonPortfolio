import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { startAuthentication } from "@/lib/auth/webauthn";
import { isSameOrigin } from "@/lib/auth/origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "origin invalide" }, { status: 403 });
  }
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json(
      { error: "Administration non configurée." },
      { status: 400 },
    );
  }
  const options = await startAuthentication(admin.id);
  return NextResponse.json(options);
}
