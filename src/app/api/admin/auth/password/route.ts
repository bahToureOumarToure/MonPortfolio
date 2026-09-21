import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminUser } from "@/lib/auth/admin";
import {
  verifyPassword,
  verifyTotp,
  isLockedOut,
  recordAttempt,
} from "@/lib/auth/password";
import { decryptSecret } from "@/lib/auth/crypto";
import { createSession } from "@/lib/auth/session";
import { isSameOrigin, clientIp } from "@/lib/auth/origin";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  password: z.string().min(1),
  totpToken: z.string().optional(),
});

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "origin invalide" }, { status: 403 });
  }

  const admin = await getAdminUser();
  if (!admin?.passwordHash) {
    return NextResponse.json(
      { error: "Administration non configurée." },
      { status: 400 },
    );
  }
  if (await isLockedOut(admin.email)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans 15 minutes." },
      { status: 429 },
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const ip = clientIp(req);
  const okPassword = await verifyPassword(
    parsed.data.password,
    admin.passwordHash,
  );
  if (!okPassword) {
    await recordAttempt(admin.email, false, ip);
    return NextResponse.json(
      { error: "Identifiants invalides." },
      { status: 401 },
    );
  }

  if (admin.isTwoFactorEnabled) {
    if (!admin.totpSecret || !parsed.data.totpToken) {
      return NextResponse.json(
        { error: "Code 2FA requis.", needsTotp: true },
        { status: 401 },
      );
    }
    const ok2fa = verifyTotp(
      parsed.data.totpToken,
      decryptSecret(admin.totpSecret),
    );
    if (!ok2fa) {
      await recordAttempt(admin.email, false, ip);
      return NextResponse.json(
        { error: "Code 2FA incorrect.", needsTotp: true },
        { status: 401 },
      );
    }
  }

  await recordAttempt(admin.email, true, ip);
  await prisma.auditLog.create({
    data: {
      action: "admin.login.password",
      entity: "User",
      entityId: admin.id,
    },
  });
  await createSession(admin.id);
  return NextResponse.json({ ok: true });
}
