import { expect, test } from "@playwright/test";

test.describe("Site public", () => {
  test("accueil : anglais et thème clair par défaut, sections et navigation", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    for (const id of ["about", "experience", "skills", "projects", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
    const bg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    expect(bg).toBe("rgb(255, 255, 255)");

    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Projects" })
      .click();
    await expect(page).toHaveURL(/#projects$/);
    expect(errors).toEqual([]);
  });

  test("aucun débordement horizontal sur mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of ["/", "/projects", "/ar", "/ar/projects"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, `débordement sur ${path}`).toBeLessThanOrEqual(0);
    }
  });

  test("menu mobile : ouverture et fermeture", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const mobileNav = page.getByRole("navigation", {
      name: "Mobile navigation",
    });
    await expect(mobileNav).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(mobileNav).toBeHidden();
  });

  test("projets : filtre par technologie et page détail", async ({ page }) => {
    await page.goto("/projects");
    const filters = page.getByRole("group", {
      name: "Filter by technology",
    });
    const counter = page.getByText(/^\d+ projects?/);
    const total = await counter.innerText();
    const firstFilter = filters.getByRole("button").nth(1);
    await firstFilter.click();
    await expect(firstFilter).toHaveAttribute("aria-pressed", "true");
    await expect(counter).not.toHaveText(total);

    const firstCard = page.locator("article").first();
    const name = await firstCard.locator("h3").innerText();
    await firstCard.locator("h3 a").click();
    await expect(page).toHaveURL(/\/projects\/\d+$/);
    await expect(page.locator("h1")).toHaveText(name);
  });

  test("compétences : défilement horizontal et nouvelles compétences", async ({
    page,
  }) => {
    await page.goto("/");
    const skills = page.locator("#skills");
    await expect(skills.locator(".animate-marquee").first()).toBeAttached();
    for (const name of [
      "Docker",
      "Kubernetes",
      "LangChain",
      "Claude Code",
      "Antigravity",
      "RAG",
      "Agentic AI",
      "Multi-Agent AI",
      "Active listening",
      "Continuous learning",
    ]) {
      await expect(
        skills.getByText(name, { exact: true }).first(),
      ).toBeAttached();
    }
  });

  test("projets : les plus valorisants en tête, chacun avec son image", async ({
    page,
  }) => {
    await page.goto("/projects");
    await expect(page.locator("article h3").first()).toHaveText(
      "Yahya-Express",
    );
    const images = page.locator("article img");
    await expect(images.first()).toBeVisible();
    const broken = await images.evaluateAll(
      (imgs) =>
        imgs.filter(
          (img) =>
            (img as HTMLImageElement).complete &&
            (img as HTMLImageElement).naturalWidth === 0,
        ).length,
    );
    expect(broken).toBe(0);
  });

  test("page 404 soignée", async ({ page }) => {
    const res = await page.goto("/projects/999999");
    expect(res?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
  });

  test("formulaire de contact : validation accessible", async ({ page }) => {
    await page.goto("/#contact");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please enter your email.")).toBeVisible();
    await expect(page.locator("#contact-name")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  test("SEO : robots.txt et sitemap.xml", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /admin");
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/projects/");
    expect(sitemap).toContain("/fr/projects");
    expect(sitemap).toContain('hreflang="ar"');
  });

  test("langues : passage en français via le sélecteur", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /^Language/ }).click();
    await page.getByRole("link", { name: "Français" }).click();
    await expect(page).toHaveURL(/\/fr$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(
      page.getByRole("navigation", { name: "Navigation principale" }),
    ).toBeVisible();
    await expect(
      page.locator("#skills").getByText("Écoute active").first(),
    ).toBeAttached();

    // La langue suit la navigation et le contenu des projets est traduit.
    await page.goto("/fr/projects");
    await expect(page.locator("h1")).toHaveText("Toutes mes réalisations");
    await expect(page.locator("article").first()).toContainText(
      "Développement de l'API back-end",
    );
  });

  test("langues : espagnol et arabe (droite à gauche)", async ({ page }) => {
    await page.goto("/es");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Creando",
    );

    await page.goto("/ar/projects/9");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "ar");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(page.getByText("أبرز النقاط")).toBeVisible();

    // Balises hreflang pour chaque langue + x-default.
    for (const lang of ["en", "fr", "es", "ar", "x-default"]) {
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${lang}"]`),
      ).toHaveCount(1);
    }
  });

  test("langues : /en redirige vers l'URL sans préfixe", async ({ page }) => {
    await page.goto("/en/projects");
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page).not.toHaveURL(/\/en\//);
  });
});
