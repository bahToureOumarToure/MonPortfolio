"use server";
import { prisma } from "@/lib/db";
import {
  heroInput,
  profileInput,
  settingsInput,
} from "@/lib/validation/singletons";
import { ensureImageMedia } from "@/lib/media-resolve";
import { assertAdmin, audit, revalidateContent, run } from "./common";
import type { ActionResult } from "./result";

export async function updateHero(input: unknown): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    const data = heroInput.parse(input);
    const payload = {
      tagline: data.tagline,
      headingTop: data.headingTop,
      headingBottom: data.headingBottom,
      name: data.name,
      designation: data.designation,
      alternateWords: data.alternateWords.filter(Boolean),
      subheading: data.subheading,
      ctaPrimaryLabel: data.ctaPrimaryLabel,
      ctaPrimaryHref: data.ctaPrimaryHref,
      ctaResumeLabel: data.ctaResumeLabel,
      heroImageId: await ensureImageMedia(data.heroImage),
    };
    await prisma.hero.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...payload },
      update: payload,
    });
    await audit("hero.update", "Hero", "singleton");
    await revalidateContent(["hero"], ["/"]);
    return undefined;
  });
}

export async function updateProfile(input: unknown): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    const data = profileInput.parse(input);
    const payload = {
      aboutTitle: data.aboutTitle,
      aboutHighlight: data.aboutHighlight,
      description: data.description,
      imageId: await ensureImageMedia(data.image),
    };
    await prisma.profile.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...payload },
      update: payload,
    });
    await audit("profile.update", "Profile", "singleton");
    await revalidateContent(["profile"], ["/"]);
    return undefined;
  });
}

export async function updateSettings(input: unknown): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    const data = settingsInput.parse(input);
    const payload = {
      siteTitle: data.siteTitle,
      metaDescription: data.metaDescription,
      contactEmail: data.contactEmail,
      phone: data.phone,
      address: data.address,
      footerTagline: data.footerTagline,
      resumeExternalUrl: data.resumeExternalUrl || null,
    };
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...payload },
      update: payload,
    });
    await audit("settings.update", "SiteSettings", "singleton");
    // Coordonnées et CV apparaissent partout -> revalidation globale.
    await revalidateContent(["settings", "hero"], ["/", "/projects"]);
    return undefined;
  });
}
