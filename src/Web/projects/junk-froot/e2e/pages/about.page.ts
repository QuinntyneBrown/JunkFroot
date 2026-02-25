import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class AboutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.main.getByRole('heading', { name: 'OUR STORY' });
  }

  get missionSection(): Locator {
    return this.main.getByRole('heading', { name: 'OUR MISSION' });
  }

  get caribbeanSection(): Locator {
    return this.main.getByRole('heading', { name: 'CARIBBEAN ROOTS' });
  }

  async goto(): Promise<void> {
    await this.navigateTo('/about');
  }
}
