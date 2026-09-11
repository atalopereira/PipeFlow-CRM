import { expect, test } from "@playwright/test";

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
    await page.goto("/login");
    await page.getByLabel("E-mail").fill("teste@pipeflow.com");
    await page.getByLabel("Senha", { exact: true }).fill("senha123");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByRole("button", { name: "Entrando..." })).toBeDisabled();
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });
});
