import { expect, test } from "@playwright/test";

import {
  createConfirmedTestUser,
  createTestWorkspace,
  deleteTestUser,
  uniqueTestEmail,
} from "./helpers/supabase-admin";

test.describe("Login", () => {
  test("shows inline validation errors on empty submit", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Informe seu e-mail")).toBeVisible();
    await expect(page.getByText("Informe sua senha")).toBeVisible();
  });

  test("shows an error for an invalid email format", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill("not-an-email");
    await page.getByLabel("Senha", { exact: true }).fill("any-password");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("E-mail inválido")).toBeVisible();
  });

  test("toggles password visibility", async ({ page }) => {
    await page.goto("/login");
    const passwordField = page.getByLabel("Senha", { exact: true });
    await passwordField.fill("secreta123");
    await expect(passwordField).toHaveAttribute("type", "password");

    await page.getByRole("button", { name: "Mostrar senha" }).click();
    await expect(passwordField).toHaveAttribute("type", "text");
  });

  test("shows loading state and redirects to dashboard on submit", async ({ page }) => {
    const email = uniqueTestEmail();
    const password = "senha123456";

    try {
      // Created pre-confirmed + with a workspace via the admin API (no real
      // e-mail sent), so login alone can be asserted to land on the
      // dashboard rather than onboarding.
      const userId = await createConfirmedTestUser(email, password, "Atalo Araujo");
      await createTestWorkspace(userId, "Acme Vendas");

      await page.goto("/login");
      await page.getByLabel("E-mail").fill(email);
      await page.getByLabel("Senha", { exact: true }).fill(password);
      await page.getByRole("button", { name: "Entrar" }).click();

      await expect(page.getByRole("button", { name: "Entrando..." })).toBeDisabled();
      await expect(page).toHaveURL("/dashboard");
      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    } finally {
      await deleteTestUser(email);
    }
  });
});
