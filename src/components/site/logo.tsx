import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Logo adapté au thème : texte foncé sur fond clair, texte blanc en sombre.
 * Les deux variantes sont rendues et basculent via la classe `.dark`.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn("relative inline-flex h-9 w-[22px] shrink-0", className)}
    >
      <Image
        src="/brand/logo-light.png"
        alt=""
        fill
        sizes="44px"
        className="object-contain dark:hidden"
        priority
      />
      <Image
        src="/brand/logo-dark.png"
        alt=""
        fill
        sizes="44px"
        className="hidden object-contain dark:block"
      />
    </span>
  );
}
