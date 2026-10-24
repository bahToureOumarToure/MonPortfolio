"use client";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Image de projet avec repli élégant (initiales sur fond neutre) si l'image
 * est absente ou introuvable — évite les cadres cassés.
 */
export function ProjectCover({
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    const initials = alt
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-secondary",
          className,
        )}
      >
        <span className="font-mono text-3xl font-semibold text-muted-foreground/60">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}

/**
 * Cadre d'image qui disparaît entièrement si l'image est absente ou cassée
 * (utilisé là où un grand bloc de repli serait plus gênant qu'utile).
 */
export function CoverFrame({
  src,
  alt,
  sizes,
  priority,
  className,
  imageClassName,
  href,
}: {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  href?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;

  const image = (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={cn("object-cover", imageClassName)}
    />
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("relative block", className)}
    >
      {image}
    </a>
  ) : (
    <div className={cn("relative", className)}>{image}</div>
  );
}
