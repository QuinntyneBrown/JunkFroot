import { test, expect } from '@playwright/test';
import { FindUsPage } from './pages';

test.describe('Find Us Page', () => {
  let findUsPage: FindUsPage;

  test.beforeEach(async ({ page }) => {
    findUsPage = new FindUsPage(page);
    await findUsPage.goto();
  });

  test('should display the Find the Truck heading', async () => {
    await expect(findUsPage.heading).toBeVisible();
  });

  test('should display the truck map component', async () => {
    await expect(findUsPage.truckMap).toBeVisible();
  });
});
