"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { themeInput } from "@/lib/validation/theme";
import { DEFAULT_THEME, sanitizeTheme } from "@/lib/theme";
import { assertAdmin, audit, run } from "./common";
import type { ActionResult } from "./result";

async function saveTheme(input: unknown) {
  const theme = sanitizeTheme(themeInput.parse(input));
  await prisma.siteTheme.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...theme },
    update: theme,
  });
  // Le thème est lu par le layout racine : toutes les pages doivent être régénérées.
  revalidateTag("theme");
  revalidatePath("/", "layout");
}

export async function updateTheme(input: unknown): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    await saveTheme(input);
    await audit("theme.update", "SiteTheme", "singleton");
    return undefined;
  });
}

export async function resetTheme(): Promise<ActionResult> {
  return run(async () => {
    await assertAdmin();
    await saveTheme(DEFAULT_THEME);
    await audit("theme.reset", "SiteTheme", "singleton");
    return undefined;
  });
}
