import { test, expect } from '@playwright/test';
import { AboutPage } from './pages';

test.describe('About Page', () => {
  let aboutPage: AboutPage;

  test.beforeEach(async ({ page }) => {
    aboutPage = new AboutPage(page);
    await aboutPage.goto();
  });

  test('should display the Our Story heading', async () => {
    await expect(aboutPage.heading).toBeVisible();
  });

  test('should display the mission section', async () => {
    await expect(aboutPage.missionSection).toBeVisible();
  });

  test('should display the Caribbean Roots section', async () => {
    await expect(aboutPage.caribbeanSection).toBeVisible();
  });
});
