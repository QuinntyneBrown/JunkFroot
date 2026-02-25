import { Component, ElementRef, effect, input, output, viewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartItemViewModel } from '../../models';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'jf-cart-drawer',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, CartItemComponent, ButtonComponent],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div class="fixed inset-0 bg-black/60" (click)="closed.emit()"></div>

        <div class="fixed top-0 right-0 bottom-0 w-full max-w-md bg-jf-dark shadow-xl flex flex-col">
          <div class="flex items-center justify-between p-4 border-b border-jf-gold/20">
            <h2 class="font-display text-2xl text-jf-coconut tracking-wide">YOUR CART</h2>
            <button
              #closeButton
              class="text-jf-coconut hover:text-jf-gold transition-colors"
              (click)="closed.emit()"
              aria-label="Close cart"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-4">
            @if (items().length === 0) {
              <div class="flex flex-col items-center justify-center h-full text-center">
                <svg class="h-16 w-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                <p class="font-body text-gray-400">Your cart is empty</p>
                <p class="font-body text-sm text-gray-500 mt-1">Add some fresh juice!</p>
              </div>
            } @else {
              @for (item of items(); track item.id) {
                <jf-cart-item
                  [item]="item"
                  (quantityChanged)="quantityChanged.emit($event)"
                  (removed)="itemRemoved.emit($event)"
                />
              }
            }
          </div>

          @if (items().length > 0) {
            <div class="p-4 border-t border-jf-gold/20 space-y-3">
              <div class="flex justify-between font-body text-sm text-gray-400">
                <span>Subtotal</span>
                <span>{{ subtotal() | currency }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-display text-lg text-jf-coconut">TOTAL</span>
                <span class="font-display text-lg text-jf-gold">{{ total() | currency }}</span>
              </div>
              <jf-button variant="primary" size="lg" (clicked)="checkoutClicked.emit()">
                Checkout — {{ total() | currency }}
              </jf-button>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class CartDrawerComponent {
  isOpen = input(false);
  items = input<CartItemViewModel[]>([]);
  subtotal = input(0);
  total = input(0);
  closed = output<void>();
  quantityChanged = output<{ itemId: string; quantity: number }>();
  itemRemoved = output<string>();
  checkoutClicked = output<void>();

  private readonly closeButton = viewChild<ElementRef>('closeButton');

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        setTimeout(() => this.closeButton()?.nativeElement.focus());
      }
    });
  }
}
