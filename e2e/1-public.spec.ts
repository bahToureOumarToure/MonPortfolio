import { expect, test } from "@playwright/test";

test.describe("Site public", () => {
  test("accueil : thème clair par défaut, sections et navigation", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    for (const id of ["about", "experience", "skills", "projects", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
    const bg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    expect(bg).toBe("rgb(255, 255, 255)");

    await page
      .getByRole("navigation", { name: "Navigation principale" })
      .getByRole("link", { name: "Projets" })
      .click();
    await expect(page).toHaveURL(/#projects$/);
    expect(errors).toEqual([]);
  });

  test("aucun débordement horizontal sur mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of ["/", "/projects"]) {
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
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    const mobileNav = page.getByRole("navigation", {
      name: "Navigation mobile",
    });
    await expect(mobileNav).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(mobileNav).toBeHidden();
  });

  test("projets : filtre par technologie et page détail", async ({ page }) => {
    await page.goto("/projects");
    const filters = page.getByRole("group", {
      name: "Filtrer par technologie",
    });
    const counter = page.getByText(/^\d+ projets?/);
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

  test("page 404 soignée", async ({ page }) => {
    const res = await page.goto("/projects/999999");
    expect(res?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "Page introuvable" }),
    ).toBeVisible();
  });

  test("formulaire de contact : validation accessible", async ({ page }) => {
    await page.goto("/#contact");
    await page.getByRole("button", { name: "Envoyer" }).click();
    await expect(page.getByText("Indique ton nom.")).toBeVisible();
    await expect(page.getByText("Indique ton email.")).toBeVisible();
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
  });
});
