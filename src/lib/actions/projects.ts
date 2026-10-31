"use server";
import { prisma } from "@/lib/db";
import { projectInput } from "@/lib/validation/project";
import { idList } from "@/lib/validation/collections";
import { ensureImageMedia } from "@/lib/media-resolve";
import { TRANSLATABLE } from "@/lib/translate";
import {
  assertAdmin,
  audit,
  revalidateContent,
  run,
  translationsData,
} from "./common";
import type { ActionResult } from "./result";

async function revalidateProjects(
  legacyIds: (number | null | undefined)[] = [],
) {
  const paths = ["/", "/projects"];
  for (const id of legacyIds) if (id != null) paths.push(`/projects/${id}`);
  await revalidateContent(["projects"], paths);
}

/** Remplace la galerie d'un projet (la première image devient l'image principale). */
async function syncImages(projectId: string, urls: string[]) {
  const unique = [...new Set(urls.map((u) => u.trim()).filter(Boolean))];
  await prisma.$transaction(async (tx) => {
    await tx.projectImage.deleteMany({ where: { projectId } });
    let primaryImageId: string | null = null;
    for (const [order, url] of unique.entries()) {
      const mediaId = await ensureImageMedia(url, tx);
      if (!mediaId) continue;
      if (order === 0) primaryImageId = mediaId;
      await tx.projectImage.create({ data: { projectId, mediaId, order } });
    }
    await tx.project.update({
      where: { id: projectId },
      data: { primaryImageId },
    });
  });
}

function projectData(data: ReturnType<typeof projectInput.parse>) {
  return {
    name: data.name,
    description: data.description,
    role: data.role,
    tools: data.tools.filter(Boolean),
    highlights: data.highlights.filter(Boolean),
    challenges: data.challenges.filter(Boolean),
    codeUrl: data.codeUrl || null,
    demoUrl: data.demoUrl || null,
    date: data.date || null,
    status: data.status || null,
    featured: data.featured,
    active: data.active,
    ...translationsData(data.translations, TRANSLATABLE.project),
  };
}

export async function createProject(
  input: unknown,
): Promise<ActionResult<{ id: string; legacyId: number }>> {
  return run(async () => {
    await assertAdmin();
    const data = projectInput.parse(input);
    const max = await prisma.project.aggregate({
      _max: { legacyId: true, order: true },
    });
    const legacyId = (max._max.legacyId ?? 0) + 1;
    const project = await prisma.project.create({
      data: {
        ...projectData(data),
        legacyId,
        order: (max._max.order ?? -1) + 1,
      },
    });
    await syncImages(project.id, data.images);
    await audit("project.create", "Project", project.id);
    await revalidateProjects([legacyId]);
    return { id: project.id, legacyId };
  });
}

export async function updateProject(
  id: string,
  input: unknown,
): Promise<ActionResult<{ id: string; legacyId: number | null }>> {
  return run(async () => {
    await assertAdmin();
    const data = projectInput.parse(input);
    const project = await prisma.project.update({
      where: { id },
      data: projectData(data),
    });
    await syncImages(project.id, data.images);
    await audit("project.update", "Project", project.id);
    await revalidateProjects([project.legacyId]);
    return { id: project.id, legacyId: project.legacyId };
  });
}

export async function deleteProject(id: string): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    const project = await prisma.project.delete({ where: { id } });
    await audit("project.delete", "Project", id);
    await revalidateProjects([project.legacyId]);
    return undefined;
  });
}

/** Bascule rapide « visible » / « mis en avant » depuis la liste. */
export async function setProjectFlags(
  id: string,
  flags: { active?: boolean; featured?: boolean },
): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(typeof flags.active === "boolean" ? { active: flags.active } : {}),
        ...(typeof flags.featured === "boolean"
          ? { featured: flags.featured }
          : {}),
      },
    });
    await audit("project.flags", "Project", id);
    await revalidateProjects([project.legacyId]);
    return undefined;
  });
}

export async function reorderProjects(ids: string[]): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    const list = idList.parse(ids);
    await prisma.$transaction(
      list.map((id, order) =>
        prisma.project.update({ where: { id }, data: { order } }),
      ),
    );
    await revalidateProjects();
    return undefined;
  });
}
