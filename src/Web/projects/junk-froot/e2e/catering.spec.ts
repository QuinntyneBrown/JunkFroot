import { test, expect } from '@playwright/test';
import { CateringPage } from './pages';

test.describe('Catering Page', () => {
  let cateringPage: CateringPage;

  test.beforeEach(async ({ page }) => {
    cateringPage = new CateringPage(page);
    await cateringPage.goto();
  });

  test('should display the Catering heading', async () => {
    await expect(cateringPage.heading).toBeVisible();
  });

  test('should display the catering inquiry form', async () => {
    await expect(cateringPage.nameInput).toBeVisible();
    await expect(cateringPage.emailInput).toBeVisible();
    await expect(cateringPage.submitButton).toBeVisible();
  });

  test('should have an event type dropdown', async () => {
    await expect(cateringPage.eventTypeSelect).toBeVisible();
  });

  test('should have a message textarea', async () => {
    await expect(cateringPage.messageInput).toBeVisible();
  });
});
