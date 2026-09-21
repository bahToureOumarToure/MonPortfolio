import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import type {
  AuthenticatorTransportFuture,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/server";
import { prisma } from "../db";

const CHALLENGE_COOKIE = "wa_challenge";

function secret(): Uint8Array {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "dev-secret-change-me",
  );
}

export function rp() {
  return {
    rpID: process.env.AUTH_WEBAUTHN_RP_ID ?? "localhost",
    rpName: process.env.AUTH_WEBAUTHN_RP_NAME ?? "Portfolio Admin",
    origin: process.env.AUTH_WEBAUTHN_ORIGIN ?? "http://localhost:3000",
  };
}

async function setChallenge(challenge: string): Promise<void> {
  const jwt = await new SignJWT({ ch: challenge })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(secret());
  (await cookies()).set(CHALLENGE_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 300,
  });
}

async function popChallenge(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(CHALLENGE_COOKIE)?.value;
  store.delete(CHALLENGE_COOKIE);
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return (payload.ch as string) ?? null;
  } catch {
    return null;
  }
}

function toTransports(csv?: string | null): AuthenticatorTransportFuture[] {
  if (!csv) return [];
  return csv.split(",").filter(Boolean) as AuthenticatorTransportFuture[];
}

// --- Enregistrement d'une passkey (admin connecté) ---
export async function startRegistration(user: { id: string; email: string }) {
  const { rpID, rpName } = rp();
  const existing = await prisma.authenticator.findMany({
    where: { userId: user.id },
  });
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: new TextEncoder().encode(user.id),
    userName: user.email,
    attestationType: "none",
    excludeCredentials: existing.map((a) => ({
      id: a.credentialID,
      transports: toTransports(a.transports),
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
  });
  await setChallenge(options.challenge);
  return options;
}

export async function finishRegistration(
  userId: string,
  response: RegistrationResponseJSON,
  label?: string,
) {
  const expectedChallenge = await popChallenge();
  if (!expectedChallenge) return { verified: false };
  const { origin, rpID } = rp();

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });
  if (!verification.verified || !verification.registrationInfo) {
    return { verified: false };
  }

  const { credential, credentialDeviceType, credentialBackedUp } =
    verification.registrationInfo;

  await prisma.authenticator.create({
    data: {
      credentialID: credential.id,
      userId,
      name: label ?? null,
      credentialPublicKey: Buffer.from(credential.publicKey).toString(
        "base64url",
      ),
      counter: BigInt(credential.counter),
      credentialDeviceType,
      credentialBackedUp,
      transports: credential.transports?.join(",") ?? null,
    },
  });
  return { verified: true };
}

// --- Authentification par passkey ---
export async function startAuthentication(userId: string) {
  const { rpID } = rp();
  const creds = await prisma.authenticator.findMany({ where: { userId } });
  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: creds.map((a) => ({
      id: a.credentialID,
      transports: toTransports(a.transports),
    })),
    userVerification: "preferred",
  });
  await setChallenge(options.challenge);
  return options;
}

export async function finishAuthentication(
  response: AuthenticationResponseJSON,
): Promise<{ verified: boolean; userId?: string }> {
  const expectedChallenge = await popChallenge();
  if (!expectedChallenge) return { verified: false };
  const { origin, rpID } = rp();

  const authenticator = await prisma.authenticator.findUnique({
    where: { credentialID: response.id },
  });
  if (!authenticator) return { verified: false };

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    credential: {
      id: authenticator.credentialID,
      publicKey: new Uint8Array(
        Buffer.from(authenticator.credentialPublicKey, "base64url"),
      ),
      counter: Number(authenticator.counter),
      transports: toTransports(authenticator.transports),
    },
  });
  if (!verification.verified) return { verified: false };

  await prisma.authenticator.update({
    where: { credentialID: authenticator.credentialID },
    data: { counter: BigInt(verification.authenticationInfo.newCounter) },
  });
  return { verified: true, userId: authenticator.userId };
}
