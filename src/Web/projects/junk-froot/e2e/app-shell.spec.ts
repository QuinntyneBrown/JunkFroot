import { test, expect } from '@playwright/test';
import { HomePage } from './pages';

test.describe('Application Shell', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display the page title', async () => {
    const title = await homePage.getPageTitle();
    expect(title).toContain('Junkfroot');
  });

  test('should render the header with logo', async ({ page }) => {
    await expect(homePage.header).toBeVisible();
    await expect(homePage.logo).toBeVisible();
    await expect(homePage.logo).toHaveText(/JUNKFROOT/);
  });

  test('should render the footer', async () => {
    await expect(homePage.footer).toBeVisible();
  });

  test('should have navigation links in the header', async ({ page }) => {
    const header = homePage.header;
    await expect(header.getByRole('link', { name: /Menu/i })).toBeVisible();
    await expect(header.getByRole('link', { name: /Find Us/i })).toBeVisible();
  });
});
