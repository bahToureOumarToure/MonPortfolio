import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import ProjectForm from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </Link>
      <h1 className="text-3xl font-black tracking-tight">Nouveau projet</h1>
      <ProjectForm />
    </div>
  );
}
