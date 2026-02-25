import { test, expect } from '@playwright/test';
import { BasePage } from './pages';

test.describe('Navigation', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    await basePage.navigateTo('/');
  });

  test('should navigate to menu via header link', async ({ page }) => {
    await basePage.header.getByRole('link', { name: 'Menu' }).click();
    await expect(page).toHaveURL(/\/menu/);
  });

  test('should navigate to find-us via header link', async ({ page }) => {
    await basePage.header.getByRole('link', { name: 'Find Us' }).click();
    await expect(page).toHaveURL(/\/find-us/);
  });

  test('should navigate to loyalty via header link', async ({ page }) => {
    await basePage.header.getByRole('link', { name: 'Froot Fam' }).click();
    await expect(page).toHaveURL(/\/loyalty/);
  });

  test('should navigate to catering via header link', async ({ page }) => {
    await basePage.header.getByRole('link', { name: 'Catering' }).click();
    await expect(page).toHaveURL(/\/catering/);
  });

  test('should navigate to about via header link', async ({ page }) => {
    await basePage.header.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about/);
  });

  test('should navigate back to home via logo click', async ({ page }) => {
    await basePage.navigateTo('/about');
    await basePage.logo.click();
    await expect(page).toHaveURL(/\/$/);
  });
});
