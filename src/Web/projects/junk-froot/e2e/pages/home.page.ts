import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heroHeading(): Locator {
    return this.main.locator('h1').filter({ hasText: /Real Juice/i });
  }

  get viewMenuButton(): Locator {
    return this.main.getByRole('link', { name: /View the Menu/i });
  }

  get findTruckButton(): Locator {
    return this.main.getByRole('link', { name: /Find the Truck/i });
  }

  get featuredSection(): Locator {
    return this.main.getByText('FEATURED DROPS');
  }

  get productCards(): Locator {
    return this.main.locator('jf-product-card');
  }

  get frootFamSection(): Locator {
    return this.main.getByText('Join the Froot Fam');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/');
  }
}
