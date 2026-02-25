import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'jf-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="bg-jf-black sticky top-0 z-50 border-b border-jf-gold/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <a routerLink="/" class="flex items-center gap-2">
            <span class="font-display text-3xl text-jf-gold tracking-wider">JUNKFROOT</span>
          </a>

          <nav class="hidden md:flex items-center gap-6">
            <a routerLink="/menu" class="font-body text-jf-coconut hover:text-jf-gold transition-colors">Menu</a>
            <a routerLink="/find-us" class="font-body text-jf-coconut hover:text-jf-gold transition-colors">Find Us</a>
            <a routerLink="/loyalty" class="font-body text-jf-coconut hover:text-jf-gold transition-colors">Froot Fam</a>
            <a routerLink="/catering" class="font-body text-jf-coconut hover:text-jf-gold transition-colors">Catering</a>
            <a routerLink="/about" class="font-body text-jf-coconut hover:text-jf-gold transition-colors">About</a>
          </nav>

          <div class="flex items-center gap-4">
            <button
              class="relative text-jf-coconut hover:text-jf-gold transition-colors"
              (click)="cartToggled.emit()"
              aria-label="Shopping cart"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              @if (cartItemCount() > 0) {
                <span class="absolute -top-2 -right-2 bg-jf-sorrel text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {{ cartItemCount() }}
                </span>
              }
            </button>

            @if (isLoggedIn()) {
              <a routerLink="/account/profile" class="text-jf-coconut hover:text-jf-gold transition-colors">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </a>
            } @else {
              <a routerLink="/login" class="font-body text-sm text-jf-gold border border-jf-gold px-3 py-1.5 rounded hover:bg-jf-gold hover:text-jf-black transition-colors">
                Sign In
              </a>
            }

            <button
              class="md:hidden text-jf-coconut hover:text-jf-gold transition-colors"
              (click)="menuToggled.emit()"
              aria-label="Toggle menu"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  cartItemCount = input(0);
  isLoggedIn = input(false);
  cartToggled = output<void>();
  menuToggled = output<void>();
}
