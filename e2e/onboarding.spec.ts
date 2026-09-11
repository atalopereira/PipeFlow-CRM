import { expect, test } from "@playwright/test";

test.describe("Onboarding", () => {
  test("shows an inline validation error on empty submit", async ({ page }) => {
    await page.goto("/onboarding");
    await page.getByRole("button", { name: "Criar workspace e continuar" }).click();

    await expect(page.getByText("Informe um nome para o workspace")).toBeVisible();
  });

  test("shows loading state and redirects to dashboard on valid submit", async ({ page }) => {
    await page.goto("/onboarding");
    await page.getByLabel("Nome do workspace").fill("Acme Vendas");
    await page.getByRole("button", { name: "Criar workspace e continuar" }).click();

    await expect(page.getByRole("button", { name: "Criando workspace..." })).toBeDisabled();
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });
});
