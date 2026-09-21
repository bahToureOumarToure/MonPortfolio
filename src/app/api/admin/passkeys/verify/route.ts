import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { finishRegistration } from "@/lib/auth/webauthn";
import { isSameOrigin } from "@/lib/auth/origin";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  response: z.any(),
  label: z.string().max(60).optional(),
});

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "origin invalide" }, { status: 403 });
  }
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const result = await finishRegistration(
    user.id,
    parsed.data.response,
    parsed.data.label,
  );
  if (!result.verified) {
    return NextResponse.json(
      { error: "Enregistrement de la passkey échoué." },
      { status: 400 },
    );
  }

  await prisma.auditLog.create({
    data: { action: "passkey.register", entity: "User", entityId: user.id },
  });
  return NextResponse.json({ ok: true });
}
