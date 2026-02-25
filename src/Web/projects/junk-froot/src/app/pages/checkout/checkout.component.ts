import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@junkfroot/components';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, ButtonComponent],
  template: `
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="font-display text-4xl text-jf-coconut tracking-wider mb-8">CHECKOUT</h1>

      <div class="bg-jf-dark rounded-xl p-6 border border-jf-gold/10 mb-6">
        <h2 class="font-display text-xl text-jf-coconut tracking-wide mb-4">ORDER SUMMARY</h2>
        @for (item of cartStore.items(); track item.id) {
          <div class="flex justify-between font-body text-sm text-gray-400 py-2">
            <span>{{ item.productName }} x{{ item.quantity }}</span>
            <span>{{ item.lineTotal | currency }}</span>
          </div>
        }
        <div class="border-t border-jf-gold/20 mt-4 pt-4 flex justify-between">
          <span class="font-display text-lg text-jf-coconut">TOTAL</span>
          <span class="font-display text-lg text-jf-gold">{{ cartStore.total() | currency }}</span>
        </div>
      </div>

      <div class="bg-jf-dark rounded-xl p-6 border border-jf-gold/10">
        <h2 class="font-display text-xl text-jf-coconut tracking-wide mb-4">PAYMENT</h2>
        <p class="font-body text-sm text-gray-400 mb-6">
          Square payment integration will be available here.
        </p>
        <jf-button variant="primary" size="lg" [disabled]="cartStore.isEmpty()">
          Place Order — {{ cartStore.total() | currency }}
        </jf-button>
      </div>
    </div>
  `,
})
export class CheckoutComponent {
  cartStore = inject(CartStore);
}
