"use client";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, ChevronDown, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";
import { LOCALE_META, locales } from "@/i18n/routing";

/** Choix de la langue : liens réels (indexables) vers la même page traduite. */
export function LanguageSwitcher({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const t = useTranslations("Common");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="language-menu"
        aria-label={`${t("language")} : ${LOCALE_META[locale as keyof typeof LOCALE_META].label}`}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border bg-background px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Languages className="h-4 w-4 text-muted-foreground" />
        <span className="uppercase">{locale}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <ul
          id="language-menu"
          aria-label={t("language")}
          className="absolute end-0 top-full z-50 mt-2 min-w-40 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg"
        >
          {locales.map((l) => (
            <li key={l}>
              <Link
                href={pathname}
                locale={l}
                hrefLang={l}
                lang={l}
                dir={LOCALE_META[l].dir}
                aria-current={l === locale ? "true" : undefined}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                  l === locale && "font-medium",
                )}
              >
                {LOCALE_META[l].label}
                {l === locale && <Check className="h-4 w-4 text-primary" />}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
