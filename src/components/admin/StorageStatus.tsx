"use client";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { getStorageStatus } from "@/lib/upload-client";
import type { StorageStatus as Status } from "@/lib/upload-rules";
import { Button } from "@/components/ui/button";

/** Diagnostic du stockage des fichiers (Vercel Blob), avec la marche à suivre. */
export default function StorageStatus() {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function check(force = false) {
    setLoading(true);
    setError(null);
    try {
      setStatus(await getStorageStatus(force));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Vérification impossible.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    check();
  }, []);

  if (loading && !status) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <LoaderCircle className="h-4 w-4 animate-spin" /> Vérification du
        stockage des fichiers…
      </p>
    );
  }

  if (status?.ok) {
    return (
      <p className="flex items-center gap-2 text-sm text-success">
        <CheckCircle2 className="h-4 w-4" />
        Stockage des fichiers opérationnel
        {status.mode === "server" && (
          <span className="text-muted-foreground">
            (fichiers de 4 Mo maximum)
          </span>
        )}
      </p>
    );
  }

  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm"
    >
      <p className="flex items-center gap-2 font-medium text-destructive">
        <CircleAlert className="h-4 w-4 shrink-0" />
        {error ??
          (status?.mode === "none"
            ? "Aucun stockage de fichiers n'est relié au site : les uploads ne peuvent pas fonctionner."
            : "Le stockage de fichiers est relié mais inaccessible.")}
      </p>
      {status?.error && (
        <p className="font-mono text-xs text-muted-foreground">
          {status.error}
        </p>
      )}
      {!error && (
        <ol className="ml-5 list-decimal space-y-1 text-muted-foreground">
          <li>
            Sur vercel.com, ouvre le projet{" "}
            <strong className="text-foreground">mon-portfolio</strong> › onglet{" "}
            <strong className="text-foreground">Storage</strong>.
          </li>
          <li>
            Crée (ou choisis) un store{" "}
            <strong className="text-foreground">Blob</strong> en accès public et
            relie-le au projet pour Production et Preview.
          </li>
          <li>
            Redéploie le site (Deployments › … › Redeploy), puis clique sur «
            Revérifier ».
          </li>
        </ol>
      )}
      <p className="text-muted-foreground">
        En attendant, tu peux ajouter tes images avec le bouton « Ajouter par
        lien ».
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => check(true)}
        disabled={loading}
      >
        {loading ? <LoaderCircle className="animate-spin" /> : <RefreshCw />}
        Revérifier
      </Button>
    </div>
  );
}
