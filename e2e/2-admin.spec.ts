import { expect, test, type Page } from "@playwright/test";

const PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "local-test-password";

async function login(page: Page) {
  await page.goto("/admin/login");
  await page.locator("#login-password").fill(PASSWORD);
  await page.getByRole("button", { name: "Se connecter", exact: true }).click();
  await page.waitForURL("**/admin");
}

test.describe("Admin", () => {
  test("accès protégé : redirection vers la connexion", async ({ page }) => {
    await page.goto("/admin/projects");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("mauvais mot de passe refusé", async ({ page }) => {
    await page.goto("/admin/login");
    await page.locator("#login-password").fill("mauvais-mot-de-passe");
    await page
      .getByRole("button", { name: "Se connecter", exact: true })
      .click();
    await expect(page.getByText("Identifiants invalides.")).toBeVisible();
  });

  test("compétences : ajout puis suppression", async ({ page }) => {
    await login(page);
    await page.goto("/admin/skills");
    const name = `E2E ${Date.now()}`;
    await page.locator("#s-name").fill(name);
    await page.locator("#s-cat").selectOption("TOOLS");
    await page
      .locator("#skill-form")
      .getByRole("button", { name: "Ajouter" })
      .click();
    await expect(page.getByText("Compétence ajoutée.")).toBeVisible();

    const row = page.locator("li", { hasText: name });
    await expect(row).toBeVisible();
    page.once("dialog", (d) => d.accept());
    await row.getByRole("button", { name: "Supprimer" }).click();
    await expect(page.getByText("Compétence supprimée.")).toBeVisible();
    await expect(row).toHaveCount(0);
  });

  test("traductions : nom traduit d'une compétence affiché en français", async ({
    page,
    browser,
  }) => {
    await login(page);
    await page.goto("/admin/skills");
    const stamp = Date.now();
    const name = `E2E en ${stamp}`;
    const french = `E2E fr ${stamp}`;
    await page.locator("#s-name").fill(name);
    await page.locator("#s-cat").selectOption("TOOLS");
    await page.locator("#s-tr-fr").fill(french);
    await page
      .locator("#skill-form")
      .getByRole("button", { name: "Ajouter" })
      .click();
    await expect(page.getByText("Compétence ajoutée.")).toBeVisible();

    const visitor = await browser.newPage();
    await visitor.goto("/fr");
    await expect(
      visitor.locator("#skills").getByText(french, { exact: true }).first(),
    ).toBeAttached();
    await visitor.goto("/");
    await expect(
      visitor.locator("#skills").getByText(name, { exact: true }).first(),
    ).toBeAttached();
    await visitor.close();

    const row = page.locator("li", { hasText: name });
    page.once("dialog", (d) => d.accept());
    await row.getByRole("button", { name: "Supprimer" }).click();
    await expect(page.getByText("Compétence supprimée.")).toBeVisible();
  });

  test("paramètres : erreur de validation lisible", async ({ page }) => {
    await login(page);
    await page.goto("/admin/settings");
    // Accepté par la validation native du navigateur, refusé par le serveur.
    await page.locator("#st-email").fill("contact@exemple");
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.getByText("Email public invalide.")).toBeVisible();
  });

  test("apparence : passage en sombre puis retour au thème par défaut", async ({
    page,
    browser,
  }) => {
    await login(page);
    await page.goto("/admin/appearance");
    await page.getByRole("radio", { name: /Sombre/ }).click();
    await page.getByRole("radio", { name: "Bleu" }).click();
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.getByText(/Apparence enregistrée/)).toBeVisible();

    const visitor = await browser.newPage();
    await visitor.goto("/");
    await expect(visitor.locator("html")).toHaveClass(/\bdark\b/);

    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: /Par défaut/ }).click();
    await expect(page.getByText("Thème par défaut rétabli.")).toBeVisible();
    await visitor.reload();
    await expect(visitor.locator("html")).not.toHaveClass(/\bdark\b/);
    await visitor.close();
  });

  test("médias : un fichier non image est refusé avant l'envoi", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/admin/media");
    await page.locator('input[type="file"]').setInputFiles({
      name: "notes.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("pas une image"),
    });
    await expect(page.getByText(/format non accepté/)).toBeVisible();
  });

  test("médias : diagnostic du stockage et ajout par lien validé", async ({
    page,
  }) => {
    test.skip(!!process.env.BLOB_READ_WRITE_TOKEN, "stockage réel configuré");
    await login(page);
    await page.goto("/admin/media");
    // Sans store Vercel Blob, les fichiers vont dans le stockage intégré.
    await expect(
      page.getByText("Stockage des fichiers opérationnel (intégré au site)"),
    ).toBeVisible();
    await page.getByRole("button", { name: /Ajouter par lien/ }).click();
    await page.locator("#img-url").fill("http://exemple.com/image.png");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Ajouter" })
      .click();
    await expect(page.getByText(/Lien invalide/)).toBeVisible();
  });

  test("médias : upload d'une image sans stockage configuré, puis suppression", async ({
    page,
    request,
  }) => {
    test.skip(!!process.env.BLOB_READ_WRITE_TOKEN, "stockage réel configuré");
    await login(page);
    await page.goto("/admin/media");
    // PNG 1×1 valide
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64",
    );
    const name = `e2e-${Date.now()}.png`;
    await page.locator('input[type="file"]').setInputFiles({
      name,
      mimeType: "image/png",
      buffer: png,
    });

    // Le fichier apparaît dans la médiathèque, servi par le site lui-même.
    const item = page.locator("li", { hasText: name });
    await expect(item).toBeVisible();
    const src = await item.locator("img").getAttribute("src");
    const url = decodeURIComponent(src ?? "").match(
      /\/media\/[^&"]+\.png/,
    )?.[0];
    expect(url, "URL du fichier envoyé").toBeTruthy();
    const served = await request.get(url!);
    expect(served.status()).toBe(200);
    expect(served.headers()["content-type"]).toBe("image/png");
    expect((await served.body()).equals(png)).toBe(true);

    // Suppression : le fichier n'est plus servi.
    page.once("dialog", (d) => d.accept());
    await item.getByRole("button", { name: `Supprimer ${name}` }).click();
    await expect(item).toHaveCount(0);
    expect((await request.get(url!)).status()).toBe(404);
  });

  test("médias : si l'upload direct vers Vercel Blob échoue, le fichier passe quand même", async ({
    page,
  }) => {
    test.skip(!!process.env.BLOB_READ_WRITE_TOKEN, "stockage réel configuré");
    // Simule un store Blob relié par jeton mais qui refuse l'upload direct
    // (ex. store privé) : le fichier doit basculer sur l'upload via le serveur.
    await page.route("**/api/admin/media/status", (route) =>
      route.fulfill({
        json: {
          mode: "client",
          ok: true,
          error: null,
          blobError: null,
          serverMaxBytes: 4 * 1024 * 1024,
        },
      }),
    );
    let directAttempts = 0;
    await page.route("**/api/admin/media/upload", (route) => {
      directAttempts++;
      return route.fulfill({
        status: 400,
        json: { error: "Vercel Blob: store privé, accès public refusé" },
      });
    });
    await login(page);
    await page.goto("/admin/media");
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64",
    );
    const name = `e2e-repli-${Date.now()}.png`;
    await page.locator('input[type="file"]').setInputFiles({
      name,
      mimeType: "image/png",
      buffer: png,
    });
    const item = page.locator("li", { hasText: name });
    await expect(item).toBeVisible();
    expect(directAttempts).toBeGreaterThan(0);

    page.once("dialog", (d) => d.accept());
    await item.getByRole("button", { name: `Supprimer ${name}` }).click();
    await expect(item).toHaveCount(0);
  });

  test("médias : un CV en PDF est publié sur le site", async ({
    page,
    browser,
    request,
  }) => {
    test.skip(!!process.env.BLOB_READ_WRITE_TOKEN, "stockage réel configuré");
    await login(page);
    await page.goto("/admin/settings");
    const pdf = Buffer.from(
      "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n",
    );
    await page.locator('input[type="file"]').setInputFiles({
      name: "cv-e2e.pdf",
      mimeType: "application/pdf",
      buffer: pdf,
    });
    await expect(page.getByText("CV publié sur le site.")).toBeVisible();

    // Le bouton CV du site pointe vers le fichier envoyé.
    const visitor = await browser.newPage();
    await visitor.goto("/");
    const href = await visitor
      .getByRole("link", { name: /Resume/ })
      .first()
      .getAttribute("href");
    await visitor.close();
    expect(href).toMatch(/^\/media\/.+\.pdf$/);
    const served = await request.get(href!);
    expect(served.status()).toBe(200);
    expect(served.headers()["content-type"]).toBe("application/pdf");

    // Retour à l'état initial (lien de secours).
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: /Retirer/ }).click();
    await expect(page.getByText("CV retiré.")).toBeVisible();
  });
});
