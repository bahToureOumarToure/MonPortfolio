"use client";
import { useEffect, useRef, useState } from "react";
import { Upload, ImagePlus, X, Star, LoaderCircle, Check } from "lucide-react";
import { uploadFile } from "@/lib/upload-client";
import { listMedia, type MediaDTO } from "@/lib/actions/media";
import {
  SLOT,
  ratioMismatch,
  describeOrientation,
  type SlotAspect,
} from "@/lib/media-format";

interface Props {
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multiple?: boolean;
  aspect?: SlotAspect;
}

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

  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [libOpen, setLibOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function commit(next: string[]) {
    onChange(multiple ? next : (next[0] ?? ""));
  }
  function addUrl(url: string) {
    if (selected.includes(url)) return;
    commit(multiple ? [...selected, url] : [url]);
  }
  function removeUrl(url: string) {
    commit(selected.filter((u) => u !== url));
  }
  function makePrimary(url: string) {
    commit([url, ...selected.filter((u) => u !== url)]);
  }

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    setWarning(null);
    setProgress(0);
    try {
      const uploaded: string[] = [];
      let mismatch = false;
      for (const file of Array.from(files)) {
        const media = await uploadFile(file, "IMAGE", (p) =>
          setProgress(p.percentage),
        );
        uploaded.push(media.url);
        if (ratioMismatch(media.width, media.height, aspect)) {
          mismatch = true;
          setWarning(
            `Image en ${describeOrientation(media.width, media.height)} : elle sera recadrée au format ${SLOT[aspect].label} de cet emplacement.`,
          );
        }
        if (!multiple) break;
      }
      if (!mismatch) setWarning(null);
      commit(multiple ? [...selected, ...uploaded] : [uploaded[0]]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'upload.");
    } finally {
      setBusy(false);
      setProgress(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Aperçu de la sélection */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {selected.map((url, i) => (
            <div
              key={url}
              className={`relative w-28 ${SLOT[aspect].cls} rounded-lg overflow-hidden border border-white/10 bg-[#0a0a0a] group`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              {multiple && i === 0 && (
                <span className="absolute top-1 left-1 text-[9px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Star className="w-2.5 h-2.5" /> Principale
                </span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {multiple && i !== 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimary(url)}
                    title="Définir comme principale"
                    className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeUrl(url)}
                  title="Retirer"
                  className="p-1.5 rounded bg-red-600/80 hover:bg-red-600 text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple={multiple}
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-red-500/40 text-sm font-medium disabled:opacity-50"
        >
          {busy ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {busy ? `Téléversement… ${progress ?? 0}%` : "Téléverser"}
        </button>
        <button
          type="button"
          onClick={() => setLibOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-red-500/40 text-sm font-medium"
        >
          <ImagePlus className="w-4 h-4" />
          Médiathèque
        </button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {warning && <p className="text-xs text-amber-400/90">⚠ {warning}</p>}
      <p className="text-[11px] text-slate-500">
        Format attendu ici : {SLOT[aspect].label}.
      </p>

      {libOpen && (
        <LibraryModal
          onClose={() => setLibOpen(false)}
          selected={selected}
          onPick={(url) => {
            addUrl(url);
            if (!multiple) setLibOpen(false);
          }}
        />
      )}
    </div>
  );
}

function LibraryModal({
  onClose,
  onPick,
  selected,
}: {
  onClose: () => void;
  onPick: (url: string) => void;
  selected: string[];
}) {
  const [items, setItems] = useState<MediaDTO[] | null>(null);

  useEffect(() => {
    listMedia("IMAGE")
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a0a] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Médiathèque</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {items === null ? (
          <p className="text-slate-500 text-sm flex items-center gap-2">
            <LoaderCircle className="w-4 h-4 animate-spin" /> Chargement…
          </p>
        ) : items.length === 0 ? (
          <p className="text-slate-500 text-sm">
            Aucune image. Téléverse depuis le bouton « Téléverser ».
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {items.map((m) => {
              const isSel = selected.includes(m.url);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onPick(m.url)}
                  className={`relative aspect-video rounded-lg overflow-hidden border ${
                    isSel ? "border-red-500" : "border-white/10"
                  } bg-[#050505] hover:border-red-500/60`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.url}
                    alt={m.alt ?? m.filename}
                    className="w-full h-full object-cover"
                  />
                  {isSel && (
                    <span className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
