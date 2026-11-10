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

/** Diagnostic du stockage des fichiers : où vont les uploads, et s'ils passent. */
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

  if (status?.ok && status.mode !== "database") {
    return (
      <p className="flex items-center gap-2 text-sm text-success">
        <CheckCircle2 className="h-4 w-4" />
        Stockage des fichiers opérationnel (Vercel Blob)
        {status.mode === "server" && (
          <span className="text-muted-foreground">
            — fichiers de 4 Mo maximum
          </span>
        )}
      </p>
    );
  }

  if (status?.ok) {
    return (
      <div className="flex flex-col gap-1.5 text-sm">
        <p className="flex items-center gap-2 text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Stockage des fichiers opérationnel (intégré au site)
          <span className="text-muted-foreground">
            — fichiers de 4 Mo maximum
          </span>
        </p>
        {status.blobError ? (
          <p className="text-xs text-muted-foreground">
            Un store Vercel Blob est relié au projet mais ne répond pas (
            <span className="font-mono">{status.blobError}</span>) : les
            fichiers sont enregistrés dans la base de données du site en
            attendant.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Les fichiers sont enregistrés dans la base de données du site : rien
            à configurer. Pour de plus gros fichiers, relie un store Blob public
            au projet dans Vercel › Storage.
          </p>
        )}
      </div>
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
          "Le stockage des fichiers est injoignable : la base de données du site ne répond pas."}
      </p>
      {status?.error && (
        <p className="font-mono text-xs text-muted-foreground">
          {status.error}
        </p>
      )}
      <p className="text-muted-foreground">
        Réessaie dans un instant. En attendant, tu peux ajouter tes images avec
        le bouton « Ajouter par lien ».
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
