import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class MenuPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.main.getByRole('heading', { name: 'OUR MENU' });
  }

  get productList(): Locator {
    return this.main.locator('jf-product-list');
  }

  get productCards(): Locator {
    return this.main.locator('jf-product-card');
  }

  get loadingSpinner(): Locator {
    return this.main.locator('jf-loading-spinner');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/menu');
  }

  async clickProduct(index: number): Promise<void> {
    await this.productCards.nth(index).click();
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }
}
