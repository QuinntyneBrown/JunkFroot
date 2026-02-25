import { test, expect } from '@playwright/test';
import { MenuPage } from './pages';

test.describe('Menu Page', () => {
  let menuPage: MenuPage;

  test.beforeEach(async ({ page }) => {
    menuPage = new MenuPage(page);
    await menuPage.goto();
  });

  test('should display the menu heading', async () => {
    await expect(menuPage.heading).toBeVisible();
  });

  test('should display the product list component', async () => {
    await expect(menuPage.productList).toBeVisible();
  });
});
