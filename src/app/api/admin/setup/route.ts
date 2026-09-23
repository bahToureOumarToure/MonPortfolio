import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import QRCode from "qrcode";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { adminEmail, hasAdminCredentials } from "@/lib/auth/admin";
import {
  hashPassword,
  generateTotpSecret,
  totpKeyUri,
  verifyTotp,
} from "@/lib/auth/password";
import { encryptSecret } from "@/lib/auth/crypto";
import { createSession } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/auth/origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SETUP_COOKIE = "setup_totp";
function key(): Uint8Array {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "dev-secret-change-me",
  );
}

// GET : démarre l'enrôlement — génère un secret TOTP + QR (une seule fois).
export async function GET() {
  if (!adminEmail()) {
    return NextResponse.json(
      { error: "ADMIN_EMAIL non configuré côté serveur." },
      { status: 400 },
    );
  }
  if (await hasAdminCredentials()) {
    return NextResponse.json(
      { error: "L'administrateur est déjà configuré." },
      { status: 403 },
    );
  }

  const secret = generateTotpSecret();
  const otpauthUrl = totpKeyUri(adminEmail(), secret);
  const qrDataUrl = await QRCode.toDataURL(otpauthUrl);

  const jwt = await new SignJWT({ s: secret })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(key());
  (await cookies()).set(SETUP_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 900,
  });

  return NextResponse.json({ email: adminEmail(), otpauthUrl, qrDataUrl });
}

const bodySchema = z.object({
  password: z.string().min(10, "Mot de passe : 10 caractères minimum."),
  totpToken: z.string().min(6),
});

// POST : finalise — vérifie le TOTP, crée le compte admin, ouvre la session.
export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "origin invalide" }, { status: 403 });
  }
  if (!adminEmail()) {
    return NextResponse.json(
      { error: "ADMIN_EMAIL non configuré côté serveur." },
      { status: 400 },
    );
  }
  if (await hasAdminCredentials()) {
    return NextResponse.json(
      { error: "L'administrateur est déjà configuré." },
      { status: 403 },
    );
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Requête invalide." },
      { status: 400 },
    );
  }

  const store = await cookies();
  const setupToken = store.get(SETUP_COOKIE)?.value;
  if (!setupToken) {
    return NextResponse.json(
      { error: "Session d'enrôlement expirée, recommencez." },
      { status: 400 },
    );
  }
  let secret: string;
  try {
    const { payload } = await jwtVerify(setupToken, key());
    secret = payload.s as string;
  } catch {
    return NextResponse.json(
      { error: "Session d'enrôlement invalide." },
      { status: 400 },
    );
  }

  if (!verifyTotp(parsed.data.totpToken, secret)) {
    return NextResponse.json({ error: "Code 2FA incorrect." }, { status: 400 });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.upsert({
    where: { email: adminEmail() },
    create: {
      email: adminEmail(),
      name: "Admin",
      role: "ADMIN",
      passwordHash,
      totpSecret: encryptSecret(secret),
      isTwoFactorEnabled: true,
    },
    update: {
      passwordHash,
      totpSecret: encryptSecret(secret),
      isTwoFactorEnabled: true,
    },
  });

  store.delete(SETUP_COOKIE);
  await prisma.auditLog.create({
    data: { action: "admin.setup", entity: "User", entityId: user.id },
  });
  await createSession(user.id);

  return NextResponse.json({ ok: true });
}
