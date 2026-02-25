import { Component, input, output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'jf-cart-summary',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ButtonComponent],
  template: `
    <div class="bg-jf-dark rounded-xl p-6 border border-jf-gold/10">
      <h3 class="font-display text-xl text-jf-coconut tracking-wide mb-4">ORDER SUMMARY</h3>

      <div class="space-y-3">
        <div class="flex justify-between font-body text-sm text-gray-400">
          <span>Subtotal ({{ itemCount() }} {{ itemCount() === 1 ? 'item' : 'items' }})</span>
          <span>{{ subtotal() | currency }}</span>
        </div>

        @if (comboDiscount() > 0) {
          <div class="flex justify-between font-body text-sm text-jf-lime">
            <span>Combo Discount</span>
            <span>-{{ comboDiscount() | currency }}</span>
          </div>
        }

        <div class="flex justify-between font-body text-sm text-gray-400">
          <span>Tax (HST 13%)</span>
          <span>{{ tax() | currency }}</span>
        </div>

        <div class="border-t border-jf-gold/20 pt-3 flex justify-between">
          <span class="font-display text-lg text-jf-coconut">TOTAL</span>
          <span class="font-display text-lg text-jf-gold">{{ total() | currency }}</span>
        </div>
      </div>

      <div class="mt-6">
        <jf-button
          variant="primary"
          size="lg"
          [disabled]="itemCount() === 0"
          (clicked)="checkoutClicked.emit()"
        >
          Proceed to Checkout
        </jf-button>
      </div>
    </div>
  `,
})
export class CartSummaryComponent {
  subtotal = input(0);
  tax = input(0);
  total = input(0);
  itemCount = input(0);
  comboDiscount = input(0);
  checkoutClicked = output<void>();
}
