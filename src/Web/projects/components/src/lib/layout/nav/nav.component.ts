import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'jf-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 md:hidden">
        <div class="fixed inset-0 bg-black/60" (click)="closed.emit()"></div>

        <nav class="fixed top-0 left-0 bottom-0 w-72 bg-jf-dark shadow-xl overflow-y-auto">
          <div class="flex items-center justify-between p-4 border-b border-jf-gold/20">
            <span class="font-display text-2xl text-jf-gold tracking-wider">JUNKFROOT</span>
            <button
              class="text-jf-coconut hover:text-jf-gold transition-colors"
              (click)="closed.emit()"
              aria-label="Close menu"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ul class="py-4">
            <li>
              <a routerLink="/" class="block px-6 py-3 font-body text-jf-coconut hover:bg-jf-gold/10 hover:text-jf-gold transition-colors" (click)="closed.emit()">Home</a>
            </li>
            <li>
              <a routerLink="/menu" class="block px-6 py-3 font-body text-jf-coconut hover:bg-jf-gold/10 hover:text-jf-gold transition-colors" (click)="closed.emit()">Menu</a>
            </li>
            <li>
              <a routerLink="/find-us" class="block px-6 py-3 font-body text-jf-coconut hover:bg-jf-gold/10 hover:text-jf-gold transition-colors" (click)="closed.emit()">Find the Truck</a>
            </li>
            <li>
              <a routerLink="/loyalty" class="block px-6 py-3 font-body text-jf-coconut hover:bg-jf-gold/10 hover:text-jf-gold transition-colors" (click)="closed.emit()">Froot Fam</a>
            </li>
            <li>
              <a routerLink="/catering" class="block px-6 py-3 font-body text-jf-coconut hover:bg-jf-gold/10 hover:text-jf-gold transition-colors" (click)="closed.emit()">Catering</a>
            </li>
            <li>
              <a routerLink="/about" class="block px-6 py-3 font-body text-jf-coconut hover:bg-jf-gold/10 hover:text-jf-gold transition-colors" (click)="closed.emit()">About</a>
            </li>
          </ul>

          <div class="px-6 py-4 border-t border-jf-gold/20">
            @if (isLoggedIn()) {
              <a routerLink="/account/profile" class="block py-2 font-body text-jf-coconut hover:text-jf-gold transition-colors" (click)="closed.emit()">My Account</a>
              <a routerLink="/account/orders" class="block py-2 font-body text-jf-coconut hover:text-jf-gold transition-colors" (click)="closed.emit()">My Orders</a>
            } @else {
              <a routerLink="/login" class="block py-2 font-body text-jf-gold font-semibold" (click)="closed.emit()">Sign In</a>
            }
          </div>
        </nav>
      </div>
    }
  `,
})
export class NavComponent {
  isOpen = input(false);
  isLoggedIn = input(false);
  closed = output<void>();
}
