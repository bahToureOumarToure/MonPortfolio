"use client";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/** Miniature d'admin avec repli lisible si le fichier est introuvable. */
export default function Thumb({
  src,
  alt = "",
  className,
  showMissingLabel = false,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  showMissingLabel?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-1 bg-muted text-muted-foreground",
          className,
        )}
        title={src ? "Fichier introuvable" : undefined}
      >
        <ImageOff className="h-5 w-5" />
        {showMissingLabel && src && (
          <span className="text-[11px]">Fichier introuvable</span>
        )}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
