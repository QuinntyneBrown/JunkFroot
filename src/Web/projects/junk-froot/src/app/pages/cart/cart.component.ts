import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartItemComponent, CartSummaryComponent } from '@junkfroot/components';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CartItemComponent, CartSummaryComponent],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="font-display text-4xl text-jf-coconut tracking-wider mb-8">YOUR CART</h1>

      @if (cartStore.isEmpty()) {
        <div class="text-center py-16">
          <p class="font-body text-xl text-gray-400">Your cart is empty</p>
          <p class="font-body text-gray-500 mt-2">Time to grab some fresh juice!</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            @for (item of cartStore.itemViewModels(); track item.id) {
              <jf-cart-item
                [item]="item"
                (quantityChanged)="cartStore.updateQuantity($event.itemId, $event.quantity)"
                (removed)="cartStore.removeItem($event)"
              />
            }
          </div>
          <div>
            <jf-cart-summary
              [subtotal]="cartStore.subtotal()"
              [tax]="cartStore.tax()"
              [total]="cartStore.total()"
              [itemCount]="cartStore.itemCount()"
              (checkoutClicked)="onCheckout()"
            />
          </div>
        </div>
      }
    </div>
  `,
})
export class CartPageComponent {
  cartStore = inject(CartStore);
  private router = inject(Router);

  onCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
