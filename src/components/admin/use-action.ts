"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/result";
import { useToast } from "./toaster";

/**
 * Exécute une Server Action avec état « en cours », notification de succès ou
 * d'erreur, puis rafraîchissement des données serveur.
 */
export function useAction() {
  const toast = useToast();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function execute<T>(
    action: () => Promise<ActionResult<T>>,
    options: { success?: string; refresh?: boolean } = {},
  ): Promise<ActionResult<T>> {
    setPending(true);
    try {
      const res = await action();
      if (!res.ok) {
        toast.error(res.error);
      } else {
        if (options.success) toast.success(options.success);
        if (options.refresh !== false) router.refresh();
      }
      return res;
    } catch {
      const error =
        "Connexion au serveur impossible. Vérifie ta connexion et réessaie.";
      toast.error(error);
      return { ok: false, error };
    } finally {
      setPending(false);
    }
  }

  return { pending, execute };
}

/** Déplace l'élément d'index `from` vers `to` (copie). */
export function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Avertit avant de quitter la page si des modifications ne sont pas enregistrées. */
export function useUnsavedWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);
}
