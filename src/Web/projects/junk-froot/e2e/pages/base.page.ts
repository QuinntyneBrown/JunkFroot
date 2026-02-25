import { type Page, type Locator } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  get header(): Locator {
    return this.page.locator('jf-header');
  }

  get footer(): Locator {
    return this.page.locator('jf-footer');
  }

  get main(): Locator {
    return this.page.locator('main');
  }

  get logo(): Locator {
    return this.header.getByText('JUNKFROOT');
  }

  get cartButton(): Locator {
    return this.header.locator('button[aria-label="Shopping cart"]');
  }

  get cartDrawer(): Locator {
    return this.page.locator('jf-cart-drawer');
  }

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    // Wait for Angular to bootstrap and render
    await this.page.waitForSelector('app-root jf-shell', { state: 'attached' });
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }
}
