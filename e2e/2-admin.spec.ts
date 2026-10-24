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

  test("médias : message clair si le stockage refuse l'envoi", async ({
    page,
  }) => {
    test.skip(!!process.env.BLOB_READ_WRITE_TOKEN, "stockage réel configuré");
    await login(page);
    await page.goto("/admin/media");
    // PNG 1×1 valide
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64",
    );
    await page.locator('input[type="file"]').setInputFiles({
      name: "pixel.png",
      mimeType: "image/png",
      buffer: png,
    });
    await expect(page.getByText(/stockage non configuré/)).toBeVisible();
  });
});
