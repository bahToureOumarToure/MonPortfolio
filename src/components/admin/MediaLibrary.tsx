"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Copy,
  FileText,
  FolderGit2,
  ImageIcon,
  Link2,
  LoaderCircle,
  Pencil,
  Search,
  Sparkles,
  Trash2,
  UserRound,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { assignMedia, deleteMedia, updateMediaAlt } from "@/lib/actions/media";
import type { AssignTarget, MediaDTO } from "@/lib/media-dto";
import {
  SLOT,
  describeOrientation,
  ratioMismatch,
  type SlotAspect,
} from "@/lib/media-format";
import { formatBytes } from "@/lib/upload-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Dialog from "./Dialog";
import Thumb from "./Thumb";
import ImageLinkDialog from "./ImageLinkDialog";
import StorageStatus from "./StorageStatus";
import { DropZone, UploadQueue } from "./DropZone";
import { EmptyState, Field } from "./ui";
import { useAction } from "./use-action";
import { useToast } from "./toaster";
import { useUploader } from "./use-uploader";

type Filter = "ALL" | "IMAGE" | "DOCUMENT";

export default function MediaLibrary({
  initial,
  targets,
}: {
  initial: MediaDTO[];
  targets: AssignTarget[];
}) {
  const [items, setItems] = useState<MediaDTO[]>(initial);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");
  const [assignFor, setAssignFor] = useState<MediaDTO | null>(null);
  const [altFor, setAltFor] = useState<MediaDTO | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const uploader = useUploader("IMAGE");
  const toast = useToast();
  const { pending, execute } = useAction();
  useEffect(() => setItems(initial), [initial]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (m) =>
        (filter === "ALL" || m.kind === filter) &&
        (!q ||
          m.filename.toLowerCase().includes(q) ||
          (m.alt ?? "").toLowerCase().includes(q)),
    );
  }, [items, filter, query]);

  async function onFiles(files: File[]) {
    const added = await uploader.uploadAll(files, (media) =>
      setItems((prev) => [media, ...prev]),
    );
    if (added.length > 0) {
      toast.success(
        added.length > 1
          ? `${added.length} images téléversées.`
          : "Image téléversée.",
      );
    }
  }

  async function remove(m: MediaDTO) {
    const warning =
      m.usage > 0
        ? `Ce média est utilisé à ${m.usage} endroit${m.usage > 1 ? "s" : ""} du site : il en sera retiré.\n\n`
        : "";
    if (
      !window.confirm(`${warning}Supprimer définitivement « ${m.filename} » ?`)
    )
      return;
    const previous = items;
    setItems((list) => list.filter((x) => x.id !== m.id));
    const res = await execute(() => deleteMedia(m.id), {
      success: "Média supprimé.",
    });
    if (!res.ok) setItems(previous);
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error("Copie impossible dans ce navigateur.");
    }
  }

  const counts = {
    ALL: items.length,
    IMAGE: items.filter((m) => m.kind === "IMAGE").length,
    DOCUMENT: items.filter((m) => m.kind === "DOCUMENT").length,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <StorageStatus />
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <DropZone
            kind="IMAGE"
            multiple
            onFiles={onFiles}
            label="Dépose tes images ici"
          />
          <Button
            type="button"
            variant="outline"
            className="h-auto py-3"
            onClick={() => setLinkOpen(true)}
          >
            <Link2 /> Ajouter par lien
          </Button>
        </div>
        <UploadQueue items={uploader.items} onClear={uploader.clearErrors} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Type de média"
          className="inline-flex w-fit rounded-lg border bg-background p-1"
        >
          {(
            [
              ["ALL", "Tous"],
              ["IMAGE", "Images"],
              ["DOCUMENT", "Documents"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={filter === key}
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                filter === key
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}{" "}
              <span className="text-xs text-muted-foreground">
                {counts[key]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
            aria-label="Rechercher un média"
            className="pl-9"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="h-8 w-8" />}
          title={items.length === 0 ? "Aucun média" : "Aucun résultat"}
          description={
            items.length === 0
              ? "Téléverse une première image ci-dessus."
              : "Essaie un autre filtre ou mot-clé."
          }
        />
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((m) => (
            <li
              key={m.id}
              className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm"
            >
              <div className="relative flex aspect-video items-center justify-center border-b bg-muted">
                {m.kind === "IMAGE" ? (
                  <Thumb src={m.url} alt={m.alt ?? ""} showMissingLabel />
                ) : (
                  <FileText className="h-10 w-10 text-muted-foreground" />
                )}
                {m.usage > 0 && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-medium shadow-sm">
                    <Sparkles className="h-3 w-3 text-primary" /> Utilisé
                    {m.usage > 1 ? ` ×${m.usage}` : ""}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3">
                <div className="min-w-0">
                  <p
                    className="truncate text-sm font-medium"
                    title={m.filename}
                  >
                    {m.filename}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[
                      m.width && m.height ? `${m.width}×${m.height}` : null,
                      m.size ? formatBytes(m.size) : null,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </p>
                </div>
                {m.kind === "IMAGE" && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setAssignFor(m)}
                  >
                    <Wand2 /> Utiliser pour…
                  </Button>
                )}
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      title="Copier l'URL"
                      aria-label="Copier l'URL"
                      onClick={() => copy(m.url)}
                    >
                      {copied === m.url ? (
                        <Check className="text-success" />
                      ) : (
                        <Copy />
                      )}
                    </Button>
                    {m.kind === "IMAGE" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        title="Texte alternatif"
                        aria-label="Modifier le texte alternatif"
                        onClick={() => setAltFor(m)}
                      >
                        <Pencil />
                      </Button>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive-ghost"
                    size="icon-sm"
                    title="Supprimer"
                    aria-label={`Supprimer ${m.filename}`}
                    disabled={pending}
                    onClick={() => remove(m)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ImageLinkDialog
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        onAdded={(media) => setItems((prev) => [media, ...prev])}
      />
      <AssignDialog
        media={assignFor}
        targets={targets}
        onClose={() => setAssignFor(null)}
      />
      <AltDialog
        media={altFor}
        onClose={() => setAltFor(null)}
        onSaved={(id, alt) =>
          setItems((list) => list.map((x) => (x.id === id ? { ...x, alt } : x)))
        }
      />
    </div>
  );
}

function AssignDialog({
  media,
  targets,
  onClose,
}: {
  media: MediaDTO | null;
  targets: AssignTarget[];
  onClose: () => void;
}) {
  const { pending, execute } = useAction();
  const [busyTarget, setBusyTarget] = useState<string | null>(null);

  async function assign(target: string, slot: SlotAspect, label: string) {
    if (!media) return;
    if (ratioMismatch(media.width, media.height, slot)) {
      const ok = window.confirm(
        `Cette image est en ${describeOrientation(media.width, media.height)}. ` +
          `Elle sera recadrée au format ${SLOT[slot].label}. Continuer ?`,
      );
      if (!ok) return;
    }
    setBusyTarget(target);
    const res = await execute(() => assignMedia(media.id, target), {
      success: `Image appliquée : ${label}.`,
    });
    setBusyTarget(null);
    if (res.ok) onClose();
  }

  const options = [
    {
      target: "profile",
      slot: "portrait" as const,
      label: "Photo de profil",
      icon: UserRound,
    },
    {
      target: "hero",
      slot: "wide" as const,
      label: "Image du hero",
      icon: ImageIcon,
    },
    ...targets.map((t) => ({
      target: `project:${t.id}`,
      slot: "video" as const,
      label: `Couverture — ${t.name}`,
      icon: FolderGit2,
    })),
  ];

  return (
    <Dialog
      open={!!media}
      onClose={onClose}
      title="Utiliser cette image pour…"
      description="Le changement est visible immédiatement sur le site."
    >
      <ul className="flex flex-col gap-1">
        {options.map(({ target, slot, label, icon: Icon }) => (
          <li key={target}>
            <button
              type="button"
              disabled={pending}
              onClick={() => assign(target, slot, label)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted disabled:opacity-60"
            >
              {busyTarget === target ? (
                <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-primary" />
              ) : (
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <span className="min-w-0 flex-1 truncate">{label}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {SLOT[slot].label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}

function AltDialog({
  media,
  onClose,
  onSaved,
}: {
  media: MediaDTO | null;
  onClose: () => void;
  onSaved: (id: string, alt: string) => void;
}) {
  const [alt, setAlt] = useState("");
  const { pending, execute } = useAction();
  useEffect(() => setAlt(media?.alt ?? ""), [media]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!media) return;
    const res = await execute(() => updateMediaAlt(media.id, { alt }), {
      success: "Texte alternatif enregistré.",
      refresh: false,
    });
    if (res.ok) {
      onSaved(media.id, alt);
      onClose();
    }
  }

  return (
    <Dialog
      open={!!media}
      onClose={onClose}
      size="sm"
      title="Texte alternatif"
      description="Décrit l'image pour les lecteurs d'écran et le référencement."
    >
      <form onSubmit={save} className="flex flex-col gap-4">
        <Field label="Description de l'image" htmlFor="media-alt">
          <Input
            id="media-alt"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            maxLength={200}
            placeholder="Capture du tableau de bord de l'application"
          />
        </Field>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={pending}>
            {pending && <LoaderCircle className="animate-spin" />}
            Enregistrer
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
