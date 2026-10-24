"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Briefcase,
  Cpu,
  ExternalLink,
  FolderGit2,
  GraduationCap,
  Images,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";

const GROUPS = [
  {
    label: null,
    items: [
      { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
    ],
  },
  {
    label: "Contenu",
    items: [
      { href: "/admin/profile", label: "Profil & Hero", icon: UserRound },
      { href: "/admin/projects", label: "Projets", icon: FolderGit2 },
      { href: "/admin/skills", label: "Compétences", icon: Cpu },
      { href: "/admin/experience", label: "Expérience", icon: Briefcase },
      { href: "/admin/education", label: "Formation", icon: GraduationCap },
      { href: "/admin/socials", label: "Liens sociaux", icon: Link2 },
      { href: "/admin/media", label: "Médias", icon: Images },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/settings", label: "Paramètres & CV", icon: Settings },
      { href: "/admin/security", label: "Sécurité", icon: ShieldCheck },
    ],
  },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigation admin" className="flex flex-col gap-5">
      {GROUPS.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-0.5">
          {group.label && (
            <p className="mb-1 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
          )}
          {group.items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export default function AdminNav({ email }: { email: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  const footer = (
    <div className="flex flex-col gap-1 border-t p-3">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ExternalLink className="h-4 w-4" /> Voir le site
      </a>
      <button
        type="button"
        onClick={logout}
        disabled={loggingOut}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
      >
        <LogOut className="h-4 w-4" />
        {loggingOut ? "Déconnexion…" : "Se déconnecter"}
      </button>
      <p
        className="truncate px-3 pt-2 text-xs text-muted-foreground"
        title={email}
      >
        {email}
      </p>
    </div>
  );

  return (
    <>
      {/* Barre supérieure mobile */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur lg:hidden">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <Logo className="h-7 w-[17px]" /> Admin
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Tiroir mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] animate-in slide-in-from-left flex-col border-r bg-background shadow-xl duration-200">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Logo className="h-7 w-[17px]" /> Admin
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Fermer"
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
            {footer}
          </aside>
        </div>
      )}

      {/* Barre latérale desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-background lg:flex">
        <Link
          href="/admin"
          className="flex h-16 items-center gap-2.5 border-b px-5 font-semibold"
        >
          <Logo className="h-8 w-[19px]" />
          <span>
            Admin<span className="text-primary">.</span>
          </span>
        </Link>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks />
        </div>
        {footer}
      </aside>
    </>
  );
}
