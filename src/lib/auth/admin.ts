import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@prisma/client";
import { prisma } from "../db";
import { getSessionUser } from "./session";

export function adminEmail(): string {
  return process.env.ADMIN_EMAIL ?? "";
}

/** L'unique compte admin (identifié par ADMIN_EMAIL), ou null s'il n'existe pas encore. */
export async function getAdminUser(): Promise<User | null> {
  const email = adminEmail();
  if (!email) return null;
  return prisma.user.findUnique({ where: { email } });
}

/** true si le bootstrap admin est déjà fait (mot de passe défini). */
export async function hasAdminCredentials(): Promise<boolean> {
  const u = await getAdminUser();
  return !!u?.passwordHash;
}

/** À appeler dans un layout/page admin : redirige vers /admin/login si non authentifié. */
export async function requireAdmin(): Promise<User> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}
