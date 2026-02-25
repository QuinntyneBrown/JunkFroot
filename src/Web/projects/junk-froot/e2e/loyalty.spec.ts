import { test, expect } from '@playwright/test';
import { LoyaltyPage } from './pages';

test.describe('Loyalty Page', () => {
  let loyaltyPage: LoyaltyPage;

  test.beforeEach(async ({ page }) => {
    loyaltyPage = new LoyaltyPage(page);
    await loyaltyPage.goto();
  });

  test('should display the Froot Fam heading', async () => {
    await expect(loyaltyPage.heading).toBeVisible();
  });

  test('should display the How It Works section', async () => {
    await expect(loyaltyPage.howItWorksSection).toBeVisible();
  });
});
