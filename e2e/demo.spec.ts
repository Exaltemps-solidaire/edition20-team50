import { expect, test } from "@playwright/test";

// Démo du cas passant, de bout en bout. Chaque itération ajoute ses étapes (test.step).
test("Démo : le cas passant", async ({ page }) => {
  await test.step("J'ouvre l'application", async () => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  await test.step("Je choisis le rôle Responsable sportif territorial", async () => {
    await page.getByRole("button", { name: /Awa Diallo/ }).click();
    await expect(page.getByRole("heading", { name: "Incidents ouverts" })).toBeVisible();
  });

  await test.step("Je déclare un incident", async () => {
    await page.getByLabel("Terrain").fill("Terrain Démo");
    await page.getByLabel("Équipement").fill("Filet de volley");
    await page.getByLabel("Description").fill("Filet déchiré côté poteau");
    await page.getByRole("button", { name: "Déclarer" }).click();
  });

  await test.step("Je vérifie que l'incident apparaît dans la liste", async () => {
    await expect(page.getByText("Terrain Démo")).toBeVisible();
  });
});
