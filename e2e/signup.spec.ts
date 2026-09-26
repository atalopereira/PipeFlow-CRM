import { expect, test } from "@playwright/test";

import { deleteTestUser, uniqueTestEmail } from "./helpers/supabase-admin";

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
    await page.getByLabel("E-mail", { exact: true }).fill(uniqueTestEmail());
    await page.getByLabel("Senha", { exact: true }).fill("senha1234");
    await page.getByLabel("Confirmar senha").fill("outraSenha");
    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page.getByText("As senhas não coincidem")).toBeVisible();
    await expect(page).toHaveURL("/signup");
  });

  test("shows loading state and asks to confirm the e-mail on valid submit", async ({ page }) => {
    const email = uniqueTestEmail();

    try {
      await page.goto("/signup");
      await page.getByLabel("Nome completo").fill("Atalo Araujo");
      await page.getByLabel("E-mail", { exact: true }).fill(email);
      await page.getByLabel("Senha", { exact: true }).fill("senha1234");
      await page.getByLabel("Confirmar senha").fill("senha1234");
      await page.getByRole("button", { name: "Criar conta" }).click();

      await expect(page.getByRole("button", { name: "Criando conta..." })).toBeDisabled();
      // Email confirmation is required, so signup stays on the page with a
      // "check your inbox" message instead of navigating to onboarding.
      await expect(page).toHaveURL("/signup");
      await expect(page.getByText(email)).toBeVisible();
      await expect(page.getByText(/link de confirmação/i)).toBeVisible();
    } finally {
      await deleteTestUser(email);
    }
  });
});
