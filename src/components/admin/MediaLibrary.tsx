"use client";
import { useRef, useState } from "react";
import {
  Upload,
  Trash2,
  Copy,
  Check,
  FileText,
  LoaderCircle,
} from "lucide-react";
import { uploadFile } from "@/lib/upload-client";
import { deleteMedia, type MediaDTO } from "@/lib/actions/media";

export default function MediaLibrary({ initial }: { initial: MediaDTO[] }) {
  const [items, setItems] = useState<MediaDTO[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const added: MediaDTO[] = [];
      for (const file of Array.from(files)) {
        added.push(await uploadFile(file, "IMAGE"));
      }
      setItems((prev) => [...added, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'upload.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Supprimer ce média ? (il sera retiré partout)"))
      return;
    setItems((prev) => prev.filter((m) => m.id !== id));
    await deleteMedia(id);
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard indisponible */
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-900 text-white font-bold text-sm uppercase tracking-widest disabled:opacity-50 hover:scale-[1.02] transition-transform"
        >
          {busy ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          Téléverser des images
        </button>
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>

      {items.length === 0 ? (
        <p className="text-slate-500 text-sm">Aucun média pour l'instant.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col"
            >
              <div className="aspect-video bg-[#050505] flex items-center justify-center">
                {m.kind === "IMAGE" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.url}
                    alt={m.alt ?? m.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileText className="w-10 h-10 text-slate-600" />
                )}
              </div>
              <div className="p-3 flex flex-col gap-2">
                <p
                  className="text-xs text-slate-400 truncate"
                  title={m.filename}
                >
                  {m.filename}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copy(m.url)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300"
                  >
                    {copied === m.url ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    URL
                  </button>
                  <button
                    onClick={() => remove(m.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
