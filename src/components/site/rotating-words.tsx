"use client";
import { useEffect, useState } from "react";

/** Fait défiler une liste de mots (rendu serveur = premier mot). */
export function RotatingWords({
  words,
  className,
  interval = 2600,
}: {
  words: string[];
  className?: string;
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  if (words.length === 0) return null;
  return (
    <span className={className}>
      <span key={index} className="inline-block animate-fade-up">
        {words[index]}
      </span>
    </span>
  );
}
