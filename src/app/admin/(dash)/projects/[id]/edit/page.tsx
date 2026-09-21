import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminProject } from "@/lib/admin-queries";
import ProjectForm, {
  type ProjectFormValues,
} from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const project = await getAdminProject(id);
  if (!project) notFound();

  const initial: ProjectFormValues = {
    name: project.name,
    description: project.description,
    role: project.role,
    tools: project.tools.join(", "),
    highlights: project.highlights.join("\n"),
    challenges: project.challenges.join("\n"),
    codeUrl: project.codeUrl ?? "",
    demoUrl: project.demoUrl ?? "",
    date: project.date ?? "",
    status: project.status ?? "",
    featured: project.featured,
    active: project.active,
    order: project.order,
    images: project.images.map((i) => i.media.url).join("\n"),
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </Link>
      <h1 className="text-3xl font-black tracking-tight">
        Éditer : {project.name}
      </h1>
      <ProjectForm projectId={project.id} initial={initial} />
    </div>
  );
}
