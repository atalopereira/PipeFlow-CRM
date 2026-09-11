import { expect, test } from "@playwright/test";

test.describe("Signup", () => {
  test("shows inline validation errors on empty submit", async ({ page }) => {
    await page.goto("/signup");
    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page.getByText("Informe seu nome completo")).toBeVisible();
    await expect(page.getByText("Informe seu e-mail")).toBeVisible();
    await expect(page.getByText("A senha deve ter no mínimo 8 caracteres")).toBeVisible();
    await expect(page.getByText("Confirme sua senha")).toBeVisible();
  });

  test("shows an error when passwords do not match", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel("Nome completo").fill("Atalo Araujo");
    await page.getByLabel("E-mail", { exact: true }).fill("atalo@pipeflow.com");
    await page.getByLabel("Senha", { exact: true }).fill("senha1234");
    await page.getByLabel("Confirmar senha").fill("outraSenha");
    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page.getByText("As senhas não coincidem")).toBeVisible();
    await expect(page).toHaveURL("/signup");
  });

  test("shows loading state and redirects to onboarding on valid submit", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel("Nome completo").fill("Atalo Araujo");
    await page.getByLabel("E-mail", { exact: true }).fill("atalo@pipeflow.com");
    await page.getByLabel("Senha", { exact: true }).fill("senha1234");
    await page.getByLabel("Confirmar senha").fill("senha1234");
    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page.getByRole("button", { name: "Criando conta..." })).toBeDisabled();
    await expect(page).toHaveURL("/onboarding");
    await expect(page.getByRole("heading", { name: "Crie seu primeiro workspace" })).toBeVisible();
  });
});
