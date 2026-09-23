"use server";
import { prisma } from "@/lib/db";
import {
  heroInput,
  profileInput,
  settingsInput,
} from "@/lib/validation/singletons";
import { assertAdmin, audit, revalidateContent } from "./common";

/** Résout une URL d'image en id de média (crée le média si absent). */
async function mediaIdFromUrl(url: string): Promise<string | null> {
  const u = url.trim();
  if (!u) return null;
  const existing = await prisma.media.findFirst({ where: { url: u } });
  if (existing) return existing.id;
  const media = await prisma.media.create({
    data: {
      url: u,
      filename: u.split("/").filter(Boolean).pop() ?? "image",
      mimeType: u.endsWith(".png")
        ? "image/png"
        : /\.jpe?g$/.test(u)
          ? "image/jpeg"
          : "image/*",
      kind: "IMAGE",
    },
  });
  return media.id;
}

export async function updateHero(input: unknown) {
  await assertAdmin();
  const data = heroInput.parse(input);
  const heroImageId = await mediaIdFromUrl(data.heroImage);
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
    heroImageId,
  };
  await prisma.hero.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...payload },
    update: payload,
  });
  await audit("hero.update", "Hero", "singleton");
  await revalidateContent(["hero"], ["/"]);
}

export async function updateProfile(input: unknown) {
  await assertAdmin();
  const data = profileInput.parse(input);
  const imageId = await mediaIdFromUrl(data.image);
  const payload = {
    aboutTitle: data.aboutTitle,
    aboutHighlight: data.aboutHighlight,
    description: data.description,
    imageId,
  };
  await prisma.profile.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...payload },
    update: payload,
  });
  await audit("profile.update", "Profile", "singleton");
  await revalidateContent(["profile"], ["/"]);
}

export async function updateSettings(input: unknown) {
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
  // Le CV et les coordonnées apparaissent partout -> revalider globalement.
  await revalidateContent(["settings", "hero"], ["/", "/projects"]);
}
