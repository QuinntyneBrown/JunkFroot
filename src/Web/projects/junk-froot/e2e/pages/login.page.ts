import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get emailInput(): Locator {
    return this.main.locator('input[type="email"]');
  }

  get passwordInput(): Locator {
    return this.main.locator('input[type="password"]');
  }

  get nameInput(): Locator {
    return this.main.locator('input[name="name"]');
  }

  get submitButton(): Locator {
    return this.main.locator('jf-button button').first();
  }

  get toggleLink(): Locator {
    return this.main.getByText('Join the Fam');
  }

  get signInHeading(): Locator {
    return this.main.getByRole('heading', { name: 'WELCOME BACK' });
  }

  get registerHeading(): Locator {
    return this.main.getByRole('heading', { name: 'JOIN THE FAM' });
  }

  async goto(): Promise<void> {
    await this.navigateTo('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async switchToRegister(): Promise<void> {
    await this.toggleLink.click();
  }
}
