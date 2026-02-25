import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class FindUsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.main.getByRole('heading', { name: 'FIND THE TRUCK' });
  }

  get truckMap(): Locator {
    return this.main.locator('jf-truck-map');
  }

  get scheduleCards(): Locator {
    return this.main.locator('jf-schedule-card');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/find-us');
  }

  async getScheduleCount(): Promise<number> {
    return this.scheduleCards.count();
  }
}
