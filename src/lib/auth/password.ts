import "server-only";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import { prisma } from "../db";

export const hashPassword = (plain: string) => bcrypt.hash(plain, 12);
export const verifyPassword = (plain: string, hash: string) =>
  bcrypt.compare(plain, hash);

export const generateTotpSecret = () => authenticator.generateSecret();
export const totpKeyUri = (email: string, secret: string) =>
  authenticator.keyuri(email, "Bah Oumar Touré — Admin", secret);
export const verifyTotp = (token: string, secret: string): boolean => {
  try {
    return authenticator.verify({ token: token.trim(), secret });
  } catch {
    return false;
  }
};

// --- Verrouillage anti-bruteforce ---
const WINDOW_MINUTES = 15;
const MAX_FAILURES = 5;

export async function isLockedOut(email: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
  const failures = await prisma.loginAttempt.count({
    where: { email, success: false, createdAt: { gte: since } },
  });
  return failures >= MAX_FAILURES;
}

export async function recordAttempt(
  email: string,
  success: boolean,
  ip?: string | null,
): Promise<void> {
  await prisma.loginAttempt.create({
    data: { email, success, ip: ip ?? undefined },
  });
}
