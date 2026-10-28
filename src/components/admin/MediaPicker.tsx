"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImagePlus,
  Link2,
  LoaderCircle,
  Search,
  Star,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { listMedia } from "@/lib/actions/media";
import type { MediaDTO } from "@/lib/media-dto";
import {
  SLOT,
  describeOrientation,
  ratioMismatch,
  type SlotAspect,
} from "@/lib/media-format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Dialog from "./Dialog";
import Thumb from "./Thumb";
import ImageLinkDialog from "./ImageLinkDialog";
import { DropZone, UploadQueue } from "./DropZone";
import { move } from "./use-action";
import { useUploader } from "./use-uploader";

interface Props {
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multiple?: boolean;
  aspect?: SlotAspect;
}

/** Sélection d'image(s) : upload direct (glisser-déposer) ou choix dans la médiathèque. */
export default function MediaPicker({
  value,
  onChange,
  multiple,
  aspect = "video",
}: Props) {
  const selected = multiple
    ? ((value as string[]) ?? [])
    : value
      ? [value as string]
      : [];
  const [warning, setWarning] = useState<string | null>(null);
  const [libOpen, setLibOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const uploader = useUploader("IMAGE");

  function commit(next: string[]) {
    onChange(multiple ? next : (next[0] ?? ""));
  }

  function checkRatio(media: MediaDTO) {
    setWarning(
      ratioMismatch(media.width, media.height, aspect)
        ? `« ${media.filename} » est en ${describeOrientation(media.width, media.height)} : elle sera recadrée au format ${SLOT[aspect].label}.`
        : null,
    );
  }

  async function onFiles(files: File[]) {
    const uploaded = await uploader.uploadAll(files);
    if (uploaded.length === 0) return;
    uploaded.forEach(checkRatio);
    const urls = uploaded.map((m) => m.url);
    commit(
      multiple
        ? [...selected, ...urls.filter((u) => !selected.includes(u))]
        : [urls[0]],
    );
  }

  function pick(media: MediaDTO) {
    checkRatio(media);
    if (multiple) {
      commit(
        selected.includes(media.url)
          ? selected.filter((u) => u !== media.url)
          : [...selected, media.url],
      );
    } else {
      commit([media.url]);
      setLibOpen(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {selected.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {selected.map((url, i) => (
            <li
              key={url}
              className={cn(
                "group relative w-32 overflow-hidden rounded-lg border bg-muted",
                SLOT[aspect].cls,
                multiple &&
                  i === 0 &&
                  "ring-2 ring-primary ring-offset-2 ring-offset-background",
              )}
            >
              <Thumb src={url} showMissingLabel />
              {multiple && i === 0 && (
                <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                  <Star className="h-2.5 w-2.5" /> Couverture
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                {multiple && i > 0 && (
                  <>
                    <IconAction
                      label="Déplacer à gauche"
                      onClick={() => commit(move(selected, i, i - 1))}
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </IconAction>
                    <IconAction
                      label="Définir comme couverture"
                      onClick={() => commit(move(selected, i, 0))}
                    >
                      <Star className="h-3.5 w-3.5" />
                    </IconAction>
                  </>
                )}
                {multiple && i < selected.length - 1 && (
                  <IconAction
                    label="Déplacer à droite"
                    onClick={() => commit(move(selected, i, i + 1))}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </IconAction>
                )}
                <IconAction
                  label="Retirer"
                  danger
                  onClick={() => commit(selected.filter((u) => u !== url))}
                >
                  <X className="h-3.5 w-3.5" />
                </IconAction>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-stretch">
        <DropZone
          kind="IMAGE"
          multiple={multiple}
          compact
          onFiles={onFiles}
          disabled={uploader.busy}
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => setLibOpen(true)}
          >
            <ImagePlus /> Médiathèque
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLinkOpen(true)}
          >
            <Link2 /> Par lien
          </Button>
        </div>
      </div>
      <UploadQueue items={uploader.items} onClear={uploader.clearErrors} />
      {warning && <p className="text-xs text-warning">⚠ {warning}</p>}
      <p className="text-xs text-muted-foreground">
        Format conseillé : {SLOT[aspect].label}.
      </p>

      <ImageLinkDialog
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        onAdded={(media) => {
          checkRatio(media);
          commit(
            multiple
              ? [...selected.filter((u) => u !== media.url), media.url]
              : [media.url],
          );
        }}
      />
      <LibraryDialog
        open={libOpen}
        onClose={() => setLibOpen(false)}
        selected={selected}
        multiple={!!multiple}
        onPick={pick}
      />
    </div>
  );
}

function IconAction({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "rounded bg-white/90 p-1 text-zinc-900 shadow hover:bg-white",
        danger &&
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      )}
    >
      {children}
    </button>
  );
}

function LibraryDialog({
  open,
  onClose,
  onPick,
  selected,
  multiple,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (m: MediaDTO) => void;
  selected: string[];
  multiple: boolean;
}) {
  const [items, setItems] = useState<MediaDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    setItems(null);
    setError(null);
    listMedia("IMAGE")
      .then((res) =>
        res.ok ? setItems(res.data) : (setError(res.error), setItems([])),
      )
      .catch(() => {
        setError("Chargement impossible.");
        setItems([]);
      });
  }, [open]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (items ?? []).filter(
      (m) => !q || m.filename.toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
      title="Médiathèque"
      description={
        multiple
          ? "Clique pour ajouter ou retirer des images."
          : "Clique sur une image pour la choisir."
      }
    >
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une image…"
            aria-label="Rechercher une image"
            className="pl-9"
          />
        </div>
        {items === null ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="h-4 w-4 animate-spin" /> Chargement…
          </p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : visible.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {items.length === 0
              ? "Aucune image. Téléverse-en depuis le formulaire."
              : "Aucun résultat."}
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {visible.map((m) => {
              const isSel = selected.includes(m.url);
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => onPick(m)}
                    aria-pressed={isSel}
                    title={m.filename}
                    className={cn(
                      "relative block aspect-video w-full overflow-hidden rounded-lg border bg-muted transition-shadow hover:ring-2 hover:ring-primary/40",
                      isSel && "ring-2 ring-primary",
                    )}
                  >
                    <Thumb src={m.url} alt={m.alt ?? m.filename} />
                    {isSel && (
                      <span className="absolute right-1.5 top-1.5 rounded-full bg-primary p-0.5 text-primary-foreground">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {multiple && (
          <div className="flex justify-end">
            <Button type="button" onClick={onClose}>
              Terminé
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
}
