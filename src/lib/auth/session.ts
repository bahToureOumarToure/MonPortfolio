import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";
import { prisma } from "../db";
import type { User } from "@prisma/client";

export const SESSION_COOKIE = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 h

function secret(): Uint8Array {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "dev-secret-change-me",
  );
}

/** Crée une session révocable (ligne DB) + cookie JWT signé httpOnly. */
export async function createSession(userId: string): Promise<void> {
  const sessionToken = crypto.randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + MAX_AGE_SECONDS * 1000);
  await prisma.session.create({ data: { sessionToken, userId, expires } });

  const jwt = await new SignJWT({ sub: userId, sid: sessionToken })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());

  const store = await cookies();
  store.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Détruit la session courante (DB + cookie). */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret());
      const sid = payload.sid as string | undefined;
      if (sid)
        await prisma.session.deleteMany({ where: { sessionToken: sid } });
    } catch {
      /* cookie invalide : rien à révoquer */
    }
  }
  store.delete(SESSION_COOKIE);
}

/**
 * Contrôle d'accès AUTORITAIRE (côté serveur) :
 * vérifie la signature du cookie, la session en DB (révocation/expiration),
 * et que l'utilisateur est bien l'admin unique.
 */
export async function getSessionUser(): Promise<User | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  let sid: string | undefined;
  let sub: string | undefined;
  try {
    const { payload } = await jwtVerify(token, secret());
    sid = payload.sid as string | undefined;
    sub = payload.sub as string | undefined;
  } catch {
    return null;
  }
  if (!sid || !sub) return null;

  const session = await prisma.session.findUnique({
    where: { sessionToken: sid },
    include: { user: true },
  });
  if (!session || session.userId !== sub || session.expires < new Date()) {
    return null;
  }

  const user = session.user;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (user.role !== "ADMIN" || !adminEmail || user.email !== adminEmail) {
    return null;
  }
  return user;
}
