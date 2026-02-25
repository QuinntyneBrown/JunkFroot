import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoyaltyPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.main.getByRole('heading', { name: 'FROOT FAM' });
  }

  get punchCard(): Locator {
    return this.main.locator('jf-punch-card');
  }

  get rewardsList(): Locator {
    return this.main.locator('jf-rewards-list');
  }

  get howItWorksSection(): Locator {
    return this.main.getByRole('heading', { name: 'HOW IT WORKS' });
  }

  async goto(): Promise<void> {
    await this.navigateTo('/loyalty');
  }
}
