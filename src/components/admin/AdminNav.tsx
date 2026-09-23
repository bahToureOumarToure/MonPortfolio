"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  UserRound,
  Briefcase,
  Link2,
  Images,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, ready: true },
  {
    href: "/admin/security",
    label: "Sécurité",
    icon: ShieldCheck,
    ready: true,
  },
  { href: "/admin/projects", label: "Projets", icon: FolderGit2, ready: true },
  { href: "/admin/skills", label: "Compétences", icon: Cpu, ready: true },
  {
    href: "/admin/profile",
    label: "Profil / Hero",
    icon: UserRound,
    ready: true,
  },
  { href: "/admin/experience", label: "Stage", icon: Briefcase, ready: true },
  { href: "/admin/socials", label: "Liens sociaux", icon: Link2, ready: true },
  { href: "/admin/media", label: "Médias", icon: Images, ready: true },
  {
    href: "/admin/settings",
    label: "Paramètres",
    icon: Settings,
    ready: true,
  },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

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

  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-[#0a0a0a] flex flex-col min-h-screen sticky top-0">
      <div className="p-6 border-b border-white/10">
        <p className="text-lg font-black text-white tracking-tight">
          Admin<span className="text-red-500">.</span>
        </p>
        <p className="text-xs text-slate-500 truncate mt-1">{email}</p>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          const base =
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all";
          if (!item.ready) {
            return (
              <span
                key={item.href}
                className={`${base} text-slate-600 cursor-not-allowed`}
                title="Bientôt disponible"
              >
                <Icon className="w-4 h-4" />
                {item.label}
                <span className="ml-auto text-[9px] uppercase tracking-widest text-slate-700">
                  bientôt
                </span>
              </span>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${base} ${
                active
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={logout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />
          {loggingOut ? "Déconnexion…" : "Se déconnecter"}
        </button>
      </div>
    </aside>
  );
}
