import { test, expect } from '@playwright/test';
import { HomePage } from './pages';

test.describe('Home Page', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display the hero section', async () => {
    await expect(homePage.heroHeading).toBeVisible();
  });

  test('should display View the Menu CTA', async () => {
    await expect(homePage.viewMenuButton).toBeVisible();
  });

  test('should display Find the Truck CTA', async () => {
    await expect(homePage.findTruckButton).toBeVisible();
  });

  test('should navigate to menu page when View Menu is clicked', async ({ page }) => {
    await homePage.viewMenuButton.click();
    await expect(page).toHaveURL(/\/menu/);
  });

  test('should navigate to find-us page when Find Truck is clicked', async ({ page }) => {
    await homePage.findTruckButton.click();
    await expect(page).toHaveURL(/\/find-us/);
  });
});
