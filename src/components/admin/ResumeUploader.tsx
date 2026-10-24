"use client";
import { ExternalLink, FileText, LoaderCircle, X } from "lucide-react";
import { setPublishedResume } from "@/lib/actions/media";
import { Button } from "@/components/ui/button";
import { DropZone, UploadQueue } from "./DropZone";
import { Panel } from "./ui";
import { useAction } from "./use-action";
import { useUploader } from "./use-uploader";

export default function ResumeUploader({
  current,
}: {
  current: { url: string; filename: string } | null;
}) {
  const uploader = useUploader("DOCUMENT");
  const { pending, execute } = useAction();

  async function onFiles(files: File[]) {
    const [media] = await uploader.uploadAll(files.slice(0, 1));
    if (!media) return;
    await execute(() => setPublishedResume(media.id), {
      success: "CV publié sur le site.",
    });
  }

  async function unpublish() {
    if (
      !window.confirm(
        "Retirer le CV publié ? Le bouton du site utilisera le lien de secours.",
      )
    )
      return;
    await execute(() => setPublishedResume(null), { success: "CV retiré." });
  }

  return (
    <Panel
      title="CV publié"
      description="Le bouton « CV » du site pointe automatiquement vers ce fichier."
    >
      <div className="flex flex-col gap-4">
        {current ? (
          <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3">
            <FileText className="h-5 w-5 shrink-0 text-primary" />
            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-0 flex-1 items-center gap-2 text-sm font-medium hover:text-primary"
            >
              <span className="truncate">{current.filename}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </a>
            <Button
              type="button"
              variant="destructive-ghost"
              size="icon-sm"
              onClick={unpublish}
              disabled={pending}
              title="Retirer le CV publié"
              aria-label="Retirer le CV publié"
            >
              {pending ? <LoaderCircle className="animate-spin" /> : <X />}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucun CV publié : le bouton du site utilise le lien de secours des
            paramètres.
          </p>
        )}
        <DropZone
          kind="DOCUMENT"
          compact
          disabled={uploader.busy || pending}
          onFiles={onFiles}
          label={current ? "Remplacer le CV (PDF)" : "Dépose ton CV (PDF)"}
        />
        <UploadQueue items={uploader.items} onClear={uploader.clearErrors} />
      </div>
    </Panel>
  );
}
