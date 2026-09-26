import { expect, test, type Page } from "@playwright/test";

import { createConfirmedTestUser, deleteTestUser, uniqueTestEmail } from "./helpers/supabase-admin";

const PASSWORD = "senha1234";

async function logIn(page: Page, email: string): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha", { exact: true }).fill(PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  // No workspace yet, so a confirmed login lands on onboarding.
  await expect(page).toHaveURL("/onboarding");
}

test.describe("Onboarding", () => {
  let email: string;

  test.beforeEach(async ({ page }) => {
    email = uniqueTestEmail();
    // Created pre-confirmed via the admin API — no real e-mail sent, avoids
    // Supabase's per-hour confirmation-email rate limit on repeated test runs.
    await createConfirmedTestUser(email, PASSWORD, "Atalo Araujo");
    await logIn(page, email);
  });

  test.afterEach(async () => {
    await deleteTestUser(email);
  });

  test("shows an inline validation error on empty submit", async ({ page }) => {
    await page.getByRole("button", { name: "Criar workspace e continuar" }).click();

    await expect(page.getByText("Informe um nome para o workspace")).toBeVisible();
  });

  test("shows loading state and redirects to dashboard on valid submit", async ({ page }) => {
    await page.getByLabel("Nome do workspace").fill("Acme Vendas");
    await page.getByRole("button", { name: "Criar workspace e continuar" }).click();

    await expect(page.getByRole("button", { name: "Criando workspace..." })).toBeDisabled();
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });
});
