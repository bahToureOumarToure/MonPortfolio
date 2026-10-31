import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { ZodError } from "zod";
import { Prisma, type User } from "@prisma/client";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { sanitizeTranslations } from "@/lib/translate";
import type { ActionResult } from "./result";

// Module serveur pur (pas "use server") : ces helpers ne sont jamais exposés
// comme endpoints appelables depuis le navigateur.

class UnauthorizedError extends Error {}
export class UserFacingError extends Error {}

/** Contrôle d'accès autoritaire pour les Server Actions. */
export async function assertAdmin(): Promise<User> {
  const user = await getSessionUser();
  if (!user) throw new UnauthorizedError();
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

/**
 * Invalide le cache + régénère les pages publiques, dans toutes les langues
 * (les pages vivent sous /[locale] : /, /fr, /es, /ar…).
 */
export async function revalidateContent(
  tags: string[],
  paths: string[] = [],
): Promise<void> {
  for (const t of tags) revalidateTag(t);
  if (paths.length) revalidatePath("/[locale]", "layout");
}

function toMessage(error: unknown): string {
  if (error instanceof UnauthorizedError) {
    return "Session expirée : reconnecte-toi pour continuer.";
  }
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Données invalides.";
  }
  if (error instanceof UserFacingError) return error.message;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") return "Élément introuvable (déjà supprimé ?).";
    if (error.code === "P2002") return "Cet élément existe déjà.";
    if (error.code === "P2021" || error.code === "P2022") {
      return "La base de données n'est pas à jour (lance « npm run db:push »).";
    }
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return "Base de données injoignable. Réessaie dans un instant.";
  }
  console.error("[admin action]", error);
  return "Une erreur inattendue est survenue.";
}

/**
 * Traductions saisies (fr / es / ar) → données Prisma. Absentes de la
 * requête : la colonne n'est pas modifiée ; toutes vides : remise à zéro.
 */
export function translationsData(input: unknown, fields: readonly string[]) {
  if (input === undefined) return {};
  const clean = sanitizeTranslations(input, fields);
  return {
    translations: clean
      ? (clean as Prisma.InputJsonValue)
      : (Prisma.DbNull as typeof Prisma.DbNull),
  };
}

/** Exécute une action admin et convertit toute erreur en message lisible. */
export async function run<T = undefined>(
  fn: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}
