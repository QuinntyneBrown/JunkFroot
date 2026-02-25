import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '@junkfroot/components';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  template: `
    <div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 class="font-display text-4xl text-jf-coconut tracking-wider text-center mb-8">
        {{ isRegister() ? 'JOIN THE FAM' : 'WELCOME BACK' }}
      </h1>

      <form (ngSubmit)="onSubmit()" class="space-y-5">
        @if (isRegister()) {
          <div>
            <label class="block font-body text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              [(ngModel)]="name"
              name="name"
              required
              class="w-full bg-jf-dark border border-jf-gold/20 rounded-lg px-4 py-3 font-body text-jf-coconut focus:border-jf-gold focus:outline-none"
            />
          </div>
        }
        <div>
          <label class="block font-body text-sm text-gray-400 mb-1">Email</label>
          <input
            type="email"
            [(ngModel)]="email"
            name="email"
            required
            class="w-full bg-jf-dark border border-jf-gold/20 rounded-lg px-4 py-3 font-body text-jf-coconut focus:border-jf-gold focus:outline-none"
          />
        </div>
        <div>
          <label class="block font-body text-sm text-gray-400 mb-1">Password</label>
          <input
            type="password"
            [(ngModel)]="password"
            name="password"
            required
            class="w-full bg-jf-dark border border-jf-gold/20 rounded-lg px-4 py-3 font-body text-jf-coconut focus:border-jf-gold focus:outline-none"
          />
        </div>
        <jf-button type="submit" variant="primary" size="lg">
          {{ isRegister() ? 'Create Account' : 'Sign In' }}
        </jf-button>
      </form>

      <p class="text-center mt-6 font-body text-sm text-gray-400">
        @if (isRegister()) {
          Already have an account?
          <button class="text-jf-gold hover:text-jf-mango transition-colors" (click)="isRegister.set(false)">Sign in</button>
        } @else {
          Don't have an account?
          <button class="text-jf-gold hover:text-jf-mango transition-colors" (click)="isRegister.set(true)">Join the Fam</button>
        }
      </p>
    </div>
  `,
})
export class LoginComponent {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  isRegister = signal(false);
  email = '';
  password = '';
  name = '';

  onSubmit(): void {
    if (this.isRegister()) {
      this.authStore.register(this.email, this.password, this.name);
    } else {
      this.authStore.login(this.email, this.password);
    }
  }
}
