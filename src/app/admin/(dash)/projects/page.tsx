import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminProjects } from "@/lib/admin-queries";
import { deleteProject } from "@/lib/actions/projects";
import DeleteButton from "@/components/admin/DeleteButton";
import { Plus, Pencil, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  await requireAdmin();
  const projects = await getAdminProjects().catch(() => []);

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Projets</h1>
          <p className="text-slate-400 mt-1">{projects.length} projet(s)</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-900 text-white font-bold text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform"
        >
          <Plus className="w-4 h-4" />
          Nouveau
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 overflow-hidden">
        {projects.length === 0 ? (
          <p className="p-6 text-slate-500 text-sm">Aucun projet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-slate-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="text-left px-4 py-3 font-bold">Nom</th>
                <th className="text-left px-4 py-3 font-bold">Ordre</th>
                <th className="text-left px-4 py-3 font-bold">État</th>
                <th className="text-right px-4 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                    {p.featured && (
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    )}
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{p.order}</td>
                  <td className="px-4 py-3">
                    {p.active ? (
                      <span className="text-emerald-400 text-xs font-bold">
                        Actif
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs font-bold">
                        Masqué
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/projects/${p.id}/edit`}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                        Éditer
                      </Link>
                      <DeleteButton
                        action={deleteProject.bind(null, p.id)}
                        confirmText={`Supprimer « ${p.name} » ?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
