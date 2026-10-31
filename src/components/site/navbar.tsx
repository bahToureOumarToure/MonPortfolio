"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import { NAV_ITEMS } from "./nav-items";

export default function Navbar({ siteName }: { siteName: string }) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Section active (accueil uniquement) : la dernière section dont le haut a
  // dépassé le tiers supérieur de l'écran.
  useEffect(() => {
    if (!isHome) {
      setActive(null);
      return;
    }
    const sections = NAV_ITEMS.map((i) => document.getElementById(i.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [isHome]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const href = (id: string) => (isHome ? `#${id}` : `/#${id}`);
  const current = isHome
    ? active
    : pathname.startsWith("/projects")
      ? "projects"
      : null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled || open
          ? "border-b bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-background",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md text-sm font-semibold tracking-tight"
          aria-label={t("home", { name: siteName })}
        >
          <Logo />
          <span className="hidden sm:inline">{siteName}</span>
        </Link>

        <nav aria-label={t("main")} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link
                  href={href(item.id)}
                  aria-current={current === item.id ? "true" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground",
                    current === item.id
                      ? "font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {t(item.id)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={href("contact")}>{t("contactMe")}</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </Container>

      {open && (
        <nav
          id="mobile-nav"
          aria-label={t("mobile")}
          className="border-t bg-background md:hidden"
        >
          <Container className="flex flex-col py-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={href(item.id)}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-base text-foreground transition-colors hover:bg-muted"
              >
                {t(item.id)}
              </Link>
            ))}
            <Button asChild className="mt-3">
              <Link href={href("contact")} onClick={() => setOpen(false)}>
                {t("contactMe")}
              </Link>
            </Button>
          </Container>
        </nav>
      )}
    </header>
  );
}
