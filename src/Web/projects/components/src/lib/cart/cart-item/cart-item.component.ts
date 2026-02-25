import { Component, input, output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartItemViewModel } from '../../models';

@Component({
  selector: 'jf-cart-item',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="flex items-center gap-4 py-4 border-b border-jf-gold/10">
      <img
        [src]="item().productImageUrl || 'assets/images/placeholder-juice.jpg'"
        [alt]="item().productName"
        class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
      />

      <div class="flex-1 min-w-0">
        <h4 class="font-body font-semibold text-jf-coconut truncate">{{ item().productName }}</h4>
        <p class="font-body text-sm text-gray-400">{{ item().unitPrice | currency }} each</p>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="w-8 h-8 rounded-full bg-jf-dark text-jf-coconut hover:bg-jf-gold hover:text-jf-black transition-colors flex items-center justify-center"
          (click)="decrementQuantity()"
          [disabled]="item().quantity <= 1"
          [class.opacity-50]="item().quantity <= 1"
        >
          −
        </button>
        <span class="font-body font-semibold text-jf-coconut w-8 text-center">{{ item().quantity }}</span>
        <button
          class="w-8 h-8 rounded-full bg-jf-dark text-jf-coconut hover:bg-jf-gold hover:text-jf-black transition-colors flex items-center justify-center"
          (click)="quantityChanged.emit({ itemId: item().id, quantity: item().quantity + 1 })"
        >
          +
        </button>
      </div>

      <span class="font-body font-bold text-jf-gold w-20 text-right">{{ item().lineTotal | currency }}</span>

      <button
        class="text-gray-500 hover:text-jf-sorrel transition-colors ml-2"
        (click)="removed.emit(item().id)"
        aria-label="Remove item"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  `,
})
export class CartItemComponent {
  item = input.required<CartItemViewModel>();
  quantityChanged = output<{ itemId: string; quantity: number }>();
  removed = output<string>();

  decrementQuantity(): void {
    if (this.item().quantity > 1) {
      this.quantityChanged.emit({ itemId: this.item().id, quantity: this.item().quantity - 1 });
    }
  }
}
