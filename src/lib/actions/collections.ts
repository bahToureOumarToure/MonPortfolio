"use server";
import { prisma } from "@/lib/db";
import {
  skillInput,
  socialInput,
  experienceInput,
  educationInput,
  idList,
} from "@/lib/validation/collections";
import { TRANSLATABLE } from "@/lib/translate";
import {
  assertAdmin,
  audit,
  revalidateContent,
  run,
  translationsData,
} from "./common";
import type { ActionResult } from "./result";

type OrderedModel = "skill" | "socialLink" | "experience" | "education";

/** Prochain rang disponible (les nouveaux éléments s'ajoutent en fin de liste). */
async function nextOrder(model: OrderedModel): Promise<number> {
  const agg =
    model === "skill"
      ? await prisma.skill.aggregate({ _max: { order: true } })
      : model === "socialLink"
        ? await prisma.socialLink.aggregate({ _max: { order: true } })
        : model === "experience"
          ? await prisma.experience.aggregate({ _max: { order: true } })
          : await prisma.education.aggregate({ _max: { order: true } });
  return (agg._max.order ?? -1) + 1;
}

/** Applique l'ordre donné (index = rang) en une transaction. */
async function applyOrder(model: OrderedModel, ids: string[]) {
  const list = idList.parse(ids);
  await prisma.$transaction(
    list.map((id, order) =>
      model === "skill"
        ? prisma.skill.update({ where: { id }, data: { order } })
        : model === "socialLink"
          ? prisma.socialLink.update({ where: { id }, data: { order } })
          : model === "experience"
            ? prisma.experience.update({ where: { id }, data: { order } })
            : prisma.education.update({ where: { id }, data: { order } }),
    ),
  );
}

// --------------------------- Skills ---------------------------
export async function createSkill(input: unknown): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    const d = skillInput.parse(input);
    const s = await prisma.skill.create({
      data: {
        name: d.name,
        category: d.category,
        iconKey: d.iconKey || d.name,
        color: d.color || null,
        active: d.active,
        ...translationsData(d.translations, TRANSLATABLE.skill),
        order: await nextOrder("skill"),
      },
    });
    await audit("skill.create", "Skill", s.id);
    await revalidateContent(["skills"], ["/"]);
    return undefined;
  });
}

export async function updateSkill(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    const d = skillInput.parse(input);
    await prisma.skill.update({
      where: { id },
      data: {
        name: d.name,
        category: d.category,
        iconKey: d.iconKey || d.name,
        color: d.color || null,
        active: d.active,
        ...translationsData(d.translations, TRANSLATABLE.skill),
      },
    });
    await audit("skill.update", "Skill", id);
    await revalidateContent(["skills"], ["/"]);
    return undefined;
  });
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    await prisma.skill.delete({ where: { id } });
    await audit("skill.delete", "Skill", id);
    await revalidateContent(["skills"], ["/"]);
    return undefined;
  });
}

export async function reorderSkills(ids: string[]): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    await applyOrder("skill", ids);
    await revalidateContent(["skills"], ["/"]);
    return undefined;
  });
}

// --------------------------- Socials ---------------------------
export async function createSocial(input: unknown): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    const d = socialInput.parse(input);
    const s = await prisma.socialLink.create({
      data: {
        platform: d.platform,
        url: d.url,
        iconKey: d.iconKey || d.platform.toLowerCase(),
        color: d.color || null,
        active: d.active,
        order: await nextOrder("socialLink"),
      },
    });
    await audit("social.create", "SocialLink", s.id);
    await revalidateContent(["socials"], ["/"]);
    return undefined;
  });
}

export async function updateSocial(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    const d = socialInput.parse(input);
    await prisma.socialLink.update({
      where: { id },
      data: {
        platform: d.platform,
        url: d.url,
        iconKey: d.iconKey || d.platform.toLowerCase(),
        color: d.color || null,
        active: d.active,
      },
    });
    await audit("social.update", "SocialLink", id);
    await revalidateContent(["socials"], ["/"]);
    return undefined;
  });
}

export async function deleteSocial(id: string): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    await prisma.socialLink.delete({ where: { id } });
    await audit("social.delete", "SocialLink", id);
    await revalidateContent(["socials"], ["/"]);
    return undefined;
  });
}

export async function reorderSocials(ids: string[]): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    await applyOrder("socialLink", ids);
    await revalidateContent(["socials"], ["/"]);
    return undefined;
  });
}

// --------------------------- Experiences ---------------------------
export async function createExperience(input: unknown): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    const d = experienceInput.parse(input);
    const e = await prisma.experience.create({
      data: {
        title: d.title,
        company: d.company,
        duration: d.duration,
        details: d.details.filter(Boolean),
        active: d.active,
        ...translationsData(d.translations, TRANSLATABLE.experience),
        order: await nextOrder("experience"),
      },
    });
    await audit("experience.create", "Experience", e.id);
    await revalidateContent(["experiences"], ["/"]);
    return undefined;
  });
}

export async function updateExperience(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    const d = experienceInput.parse(input);
    await prisma.experience.update({
      where: { id },
      data: {
        title: d.title,
        company: d.company,
        duration: d.duration,
        details: d.details.filter(Boolean),
        active: d.active,
        ...translationsData(d.translations, TRANSLATABLE.experience),
      },
    });
    await audit("experience.update", "Experience", id);
    await revalidateContent(["experiences"], ["/"]);
    return undefined;
  });
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    await prisma.experience.delete({ where: { id } });
    await audit("experience.delete", "Experience", id);
    await revalidateContent(["experiences"], ["/"]);
    return undefined;
  });
}

export async function reorderExperiences(ids: string[]): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    await applyOrder("experience", ids);
    await revalidateContent(["experiences"], ["/"]);
    return undefined;
  });
}

// --------------------------- Educations ---------------------------
export async function createEducation(input: unknown): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    const d = educationInput.parse(input);
    const { translations, ...fields } = d;
    const e = await prisma.education.create({
      data: {
        ...fields,
        ...translationsData(translations, TRANSLATABLE.education),
        order: await nextOrder("education"),
      },
    });
    await audit("education.create", "Education", e.id);
    await revalidateContent(["educations"], ["/"]);
    return undefined;
  });
}

export async function updateEducation(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    const d = educationInput.parse(input);
    const { translations, ...fields } = d;
    await prisma.education.update({
      where: { id },
      data: {
        ...fields,
        ...translationsData(translations, TRANSLATABLE.education),
      },
    });
    await audit("education.update", "Education", id);
    await revalidateContent(["educations"], ["/"]);
    return undefined;
  });
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    await prisma.education.delete({ where: { id } });
    await audit("education.delete", "Education", id);
    await revalidateContent(["educations"], ["/"]);
    return undefined;
  });
}

export async function reorderEducations(ids: string[]): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    await applyOrder("education", ids);
    await revalidateContent(["educations"], ["/"]);
    return undefined;
  });
}
