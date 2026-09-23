import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { finishAuthentication } from "@/lib/auth/webauthn";
import { createSession } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/auth/origin";
import { prisma } from "@/lib/db";

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

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const result = await finishAuthentication(body);
  // La passkey doit appartenir à l'admin unique.
  if (!result.verified || result.userId !== admin.id) {
    return NextResponse.json(
      { error: "Authentification par passkey échouée." },
      { status: 401 },
    );
  }

  await prisma.auditLog.create({
    data: { action: "admin.login.passkey", entity: "User", entityId: admin.id },
  });
  await createSession(admin.id);
  return NextResponse.json({ ok: true });
}
