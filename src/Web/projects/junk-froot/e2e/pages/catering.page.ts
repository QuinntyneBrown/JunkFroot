import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CateringPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.main.getByRole('heading', { name: 'CATERING' });
  }

  get nameInput(): Locator {
    return this.main.locator('input[name="name"], input[placeholder*="name" i]').first();
  }

  get emailInput(): Locator {
    return this.main.locator('input[name="email"], input[type="email"]').first();
  }

  get phoneInput(): Locator {
    return this.main.locator('input[name="phone"], input[type="tel"]').first();
  }

  get eventDateInput(): Locator {
    return this.main.locator('input[name="eventDate"], input[type="date"]').first();
  }

  get headcountInput(): Locator {
    return this.main.locator('input[name="headcount"], input[type="number"]').first();
  }

  get eventTypeSelect(): Locator {
    return this.main.locator('select').first();
  }

  get messageInput(): Locator {
    return this.main.locator('textarea').first();
  }

  get submitButton(): Locator {
    return this.main.locator('jf-button button, button[type="submit"]').first();
  }

  get successMessage(): Locator {
    return this.main.locator('text=REQUEST SENT');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/catering');
  }

  async fillForm(data: {
    name: string;
    email: string;
    phone: string;
    eventDate: string;
    headcount: string;
    eventType: string;
    message: string;
  }): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);
    await this.eventDateInput.fill(data.eventDate);
    await this.headcountInput.fill(data.headcount);
    await this.eventTypeSelect.selectOption(data.eventType);
    await this.messageInput.fill(data.message);
  }
}
