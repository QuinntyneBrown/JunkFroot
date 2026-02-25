import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@junkfroot/components';
import { LocationApiService, CateringRequest } from '@junkfroot/api';

@Component({
  selector: 'app-catering',
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  template: `
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="font-display text-4xl text-jf-coconut tracking-wider text-center mb-2">CATERING</h1>
      <p class="font-body text-center text-gray-400 mb-8">
        Bring the Junkfroot vibes to your next event. Fresh juice, good energy, island flavour.
      </p>

      @if (submitted()) {
        <div class="bg-jf-dark rounded-xl p-8 border border-jf-lime/30 text-center">
          <p class="font-display text-2xl text-jf-lime tracking-wide">REQUEST SENT!</p>
          <p class="font-body text-gray-300 mt-2">We'll get back to you within 24 hours.</p>
        </div>
      } @else {
        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block font-body text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              [(ngModel)]="form.name"
              name="name"
              required
              class="w-full bg-jf-dark border border-jf-gold/20 rounded-lg px-4 py-3 font-body text-jf-coconut focus:border-jf-gold focus:outline-none"
            />
          </div>
          <div>
            <label class="block font-body text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              [(ngModel)]="form.email"
              name="email"
              required
              class="w-full bg-jf-dark border border-jf-gold/20 rounded-lg px-4 py-3 font-body text-jf-coconut focus:border-jf-gold focus:outline-none"
            />
          </div>
          <div>
            <label class="block font-body text-sm text-gray-400 mb-1">Phone</label>
            <input
              type="tel"
              [(ngModel)]="form.phone"
              name="phone"
              required
              class="w-full bg-jf-dark border border-jf-gold/20 rounded-lg px-4 py-3 font-body text-jf-coconut focus:border-jf-gold focus:outline-none"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-body text-sm text-gray-400 mb-1">Event Date</label>
              <input
                type="date"
                [(ngModel)]="form.eventDate"
                name="eventDate"
                required
                class="w-full bg-jf-dark border border-jf-gold/20 rounded-lg px-4 py-3 font-body text-jf-coconut focus:border-jf-gold focus:outline-none"
              />
            </div>
            <div>
              <label class="block font-body text-sm text-gray-400 mb-1">Headcount</label>
              <input
                type="number"
                [(ngModel)]="form.headcount"
                name="headcount"
                required
                min="1"
                class="w-full bg-jf-dark border border-jf-gold/20 rounded-lg px-4 py-3 font-body text-jf-coconut focus:border-jf-gold focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label class="block font-body text-sm text-gray-400 mb-1">Event Type</label>
            <select
              [(ngModel)]="form.eventType"
              name="eventType"
              required
              class="w-full bg-jf-dark border border-jf-gold/20 rounded-lg px-4 py-3 font-body text-jf-coconut focus:border-jf-gold focus:outline-none"
            >
              <option value="">Select type...</option>
              <option value="Corporate">Corporate Event</option>
              <option value="Wedding">Wedding</option>
              <option value="Birthday">Birthday Party</option>
              <option value="Festival">Festival / Market</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label class="block font-body text-sm text-gray-400 mb-1">Message</label>
            <textarea
              [(ngModel)]="form.message"
              name="message"
              rows="4"
              class="w-full bg-jf-dark border border-jf-gold/20 rounded-lg px-4 py-3 font-body text-jf-coconut focus:border-jf-gold focus:outline-none resize-none"
            ></textarea>
          </div>
          <jf-button type="submit" variant="primary" size="lg">
            Submit Request
          </jf-button>
        </form>
      }
    </div>
  `,
})
export class CateringComponent {
  private readonly locationApi = inject(LocationApiService);
  submitted = signal(false);

  form: CateringRequest = {
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    headcount: 0,
    eventType: '',
    message: '',
  };

  onSubmit(): void {
    this.locationApi.submitCateringRequest(this.form).subscribe({
      next: () => this.submitted.set(true),
    });
  }
}
