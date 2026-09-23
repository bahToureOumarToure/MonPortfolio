"use server";
import { prisma } from "@/lib/db";
import {
  skillInput,
  socialInput,
  experienceInput,
} from "@/lib/validation/collections";
import { assertAdmin, audit, revalidateContent } from "./common";

// --------------------------- Skills ---------------------------
export async function createSkill(input: unknown) {
  await assertAdmin();
  const d = skillInput.parse(input);
  const s = await prisma.skill.create({
    data: {
      name: d.name,
      category: d.category,
      iconKey: d.iconKey || d.name,
      color: d.color || null,
      order: d.order,
      active: d.active,
    },
  });
  await audit("skill.create", "Skill", s.id);
  await revalidateContent(["skills"], ["/"]);
}

export async function updateSkill(id: string, input: unknown) {
  await assertAdmin();
  const d = skillInput.parse(input);
  await prisma.skill.update({
    where: { id },
    data: {
      name: d.name,
      category: d.category,
      iconKey: d.iconKey || d.name,
      color: d.color || null,
      order: d.order,
      active: d.active,
    },
  });
  await audit("skill.update", "Skill", id);
  await revalidateContent(["skills"], ["/"]);
}

export async function deleteSkill(id: string) {
  await assertAdmin();
  await prisma.skill.delete({ where: { id } });
  await audit("skill.delete", "Skill", id);
  await revalidateContent(["skills"], ["/"]);
}

// --------------------------- Socials ---------------------------
export async function createSocial(input: unknown) {
  await assertAdmin();
  const d = socialInput.parse(input);
  const s = await prisma.socialLink.create({
    data: {
      platform: d.platform,
      url: d.url,
      iconKey: d.iconKey || d.platform.toLowerCase(),
      color: d.color || null,
      order: d.order,
      active: d.active,
    },
  });
  await audit("social.create", "SocialLink", s.id);
  await revalidateContent(["socials"], ["/"]);
}

export async function updateSocial(id: string, input: unknown) {
  await assertAdmin();
  const d = socialInput.parse(input);
  await prisma.socialLink.update({
    where: { id },
    data: {
      platform: d.platform,
      url: d.url,
      iconKey: d.iconKey || d.platform.toLowerCase(),
      color: d.color || null,
      order: d.order,
      active: d.active,
    },
  });
  await audit("social.update", "SocialLink", id);
  await revalidateContent(["socials"], ["/"]);
}

export async function deleteSocial(id: string) {
  await assertAdmin();
  await prisma.socialLink.delete({ where: { id } });
  await audit("social.delete", "SocialLink", id);
  await revalidateContent(["socials"], ["/"]);
}

// --------------------------- Experiences (Stage) ---------------------------
export async function createExperience(input: unknown) {
  await assertAdmin();
  const d = experienceInput.parse(input);
  const e = await prisma.experience.create({
    data: {
      title: d.title,
      company: d.company,
      duration: d.duration,
      details: d.details.filter(Boolean),
      order: d.order,
      active: d.active,
    },
  });
  await audit("experience.create", "Experience", e.id);
  await revalidateContent(["experiences"], ["/"]);
}

export async function updateExperience(id: string, input: unknown) {
  await assertAdmin();
  const d = experienceInput.parse(input);
  await prisma.experience.update({
    where: { id },
    data: {
      title: d.title,
      company: d.company,
      duration: d.duration,
      details: d.details.filter(Boolean),
      order: d.order,
      active: d.active,
    },
  });
  await audit("experience.update", "Experience", id);
  await revalidateContent(["experiences"], ["/"]);
}

export async function deleteExperience(id: string) {
  await assertAdmin();
  await prisma.experience.delete({ where: { id } });
  await audit("experience.delete", "Experience", id);
  await revalidateContent(["experiences"], ["/"]);
}
