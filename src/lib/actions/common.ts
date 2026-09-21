"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import type { User } from "@prisma/client";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

/** Contrôle d'accès autoritaire pour les Server Actions. */
export async function assertAdmin(): Promise<User> {
  const user = await getSessionUser();
  if (!user) throw new Error("unauthorized");
  return user;
}

export async function audit(
  action: string,
  entity: string,
  entityId?: string | null,
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: { action, entity, entityId: entityId ?? undefined },
    });
  } catch {
    /* l'audit ne doit jamais bloquer l'opération */
  }
}

/** Invalide le cache + régénère les pages publiques concernées. */
export async function revalidateContent(
  tags: string[],
  paths: string[] = [],
): Promise<void> {
  for (const t of tags) revalidateTag(t);
  for (const p of paths) revalidatePath(p);
}
