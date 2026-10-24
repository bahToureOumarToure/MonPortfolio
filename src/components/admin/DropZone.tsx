"use client";
import { useRef, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  UPLOAD_RULES,
  formatBytes,
  type UploadKind,
} from "@/lib/upload-client";
import type { UploadItem } from "./use-uploader";

/** Zone de dépôt (glisser-déposer, clic ou clavier) pour images ou PDF. */
export function DropZone({
  kind,
  multiple = false,
  disabled = false,
  compact = false,
  onFiles,
  label,
}: {
  kind: UploadKind;
  multiple?: boolean;
  disabled?: boolean;
  compact?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const rule = UPLOAD_RULES[kind];

  function handle(list: FileList | null) {
    if (!list || list.length === 0) return;
    const files = Array.from(list);
    onFiles(multiple ? files : files.slice(0, 1));
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (!disabled) handle(e.dataTransfer.files);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        compact ? "px-4 py-5" : "px-6 py-10",
        over
          ? "border-primary bg-primary/5"
          : "bg-background hover:bg-muted/50",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={rule.accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handle(e.target.files)}
      />
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Upload className="h-4 w-4" />
      </span>
      <p className="text-sm font-medium">
        {label ??
          (multiple ? "Dépose tes fichiers ici" : "Dépose un fichier ici")}{" "}
        <span className="text-primary">ou parcours</span>
      </p>
      <p className="text-xs text-muted-foreground">
        {rule.label} · {formatBytes(rule.maxBytes)} max
        {kind === "IMAGE" && " · optimisées automatiquement"}
      </p>
    </div>
  );
}

/** Liste de progression des fichiers en cours d'envoi. */
export function UploadQueue({
  items,
  onClear,
}: {
  items: UploadItem[];
  onClear?: () => void;
}) {
  if (items.length === 0) return null;
  const hasErrors = items.some((i) => i.status === "error");
  return (
    <div className="flex flex-col gap-2" aria-live="polite">
      {items.map((item) => (
        <div
          key={item.key}
          className="rounded-lg border bg-background px-3 py-2"
        >
          <div className="flex items-center gap-2 text-sm">
            {item.status === "uploading" && (
              <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-primary" />
            )}
            {item.status === "done" && (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            )}
            {item.status === "error" && (
              <CircleAlert className="h-4 w-4 shrink-0 text-destructive" />
            )}
            <span className="min-w-0 flex-1 truncate">{item.name}</span>
            {item.status === "uploading" && (
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {Math.round(item.progress)}%
              </span>
            )}
          </div>
          {item.status === "uploading" && (
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-[width]"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          )}
          {item.error && (
            <p className="mt-1 text-xs text-destructive">{item.error}</p>
          )}
        </div>
      ))}
      {hasErrors && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" /> Effacer les erreurs
        </button>
      )}
    </div>
  );
}
