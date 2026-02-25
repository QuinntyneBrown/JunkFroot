import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@junkfroot/components';
import { AuthApiService, CustomerProfile } from '@junkfroot/api';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  template: `
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="font-display text-4xl text-jf-coconut tracking-wider mb-8">MY PROFILE</h1>

      @if (profile()) {
        <form (ngSubmit)="onSave()" class="space-y-5">
          <div>
            <label class="block font-body text-sm text-gray-400 mb-1">Display Name</label>
            <input
              type="text"
              [(ngModel)]="profile()!.displayName"
              name="displayName"
              class="w-full bg-jf-dark border border-jf-gold/20 rounded-lg px-4 py-3 font-body text-jf-coconut focus:border-jf-gold focus:outline-none"
            />
          </div>
          <div>
            <label class="block font-body text-sm text-gray-400 mb-1">Phone</label>
            <input
              type="tel"
              [(ngModel)]="profile()!.phone"
              name="phone"
              class="w-full bg-jf-dark border border-jf-gold/20 rounded-lg px-4 py-3 font-body text-jf-coconut focus:border-jf-gold focus:outline-none"
            />
          </div>
          <div>
            <label class="block font-body text-sm text-gray-400 mb-1">Birthday</label>
            <input
              type="date"
              [(ngModel)]="profile()!.birthday"
              name="birthday"
              class="w-full bg-jf-dark border border-jf-gold/20 rounded-lg px-4 py-3 font-body text-jf-coconut focus:border-jf-gold focus:outline-none"
            />
          </div>
          <jf-button type="submit" variant="primary" size="md">
            Save Changes
          </jf-button>
        </form>
      }

      <div class="mt-8 pt-8 border-t border-jf-gold/10">
        <jf-button variant="danger" size="sm" (clicked)="onLogout()">
          Sign Out
        </jf-button>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  private readonly authApi = inject(AuthApiService);
  private readonly authStore = inject(AuthStore);

  profile = signal<CustomerProfile | null>(null);

  ngOnInit(): void {
    this.authApi.getProfile().subscribe({
      next: (p) => this.profile.set(p),
    });
  }

  onSave(): void {
    const p = this.profile();
    if (p) {
      this.authApi.updateProfile(p).subscribe({
        next: (updated) => this.profile.set(updated),
      });
    }
  }

  onLogout(): void {
    this.authStore.logout();
  }
}
