import { test, expect } from '@playwright/test';
import { LoginPage } from './pages';

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display the welcome back heading', async () => {
    await expect(loginPage.signInHeading).toBeVisible();
  });

  test('should display the sign in form fields', async () => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('should have a submit button', async () => {
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('should have a toggle to switch to registration', async () => {
    await expect(loginPage.toggleLink).toBeVisible();
  });

  test('should switch to registration view when toggled', async () => {
    await loginPage.switchToRegister();
    await expect(loginPage.registerHeading).toBeVisible();
    await expect(loginPage.nameInput).toBeVisible();
  });
});
