import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShellComponent, CartDrawerComponent } from '@junkfroot/components';
import { CartStore } from './store/cart.store';
import { AuthStore } from './store/auth.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ShellComponent, CartDrawerComponent],
  template: `
    <jf-shell
      [cartItemCount]="cartStore.itemCount()"
      [isLoggedIn]="authStore.isLoggedIn()"
      (cartToggled)="cartDrawerOpen.set(!cartDrawerOpen())"
    >
      <router-outlet />
    </jf-shell>

    <jf-cart-drawer
      [isOpen]="cartDrawerOpen()"
      [items]="cartStore.items()"
      [subtotal]="cartStore.subtotal()"
      [total]="cartStore.total()"
      (closed)="cartDrawerOpen.set(false)"
      (quantityChanged)="cartStore.updateQuantity($event.itemId, $event.quantity)"
      (itemRemoved)="cartStore.removeItem($event)"
      (checkoutClicked)="onCheckout()"
    />
  `,
})
export class AppComponent {
  cartStore = inject(CartStore);
  authStore = inject(AuthStore);
  cartDrawerOpen = signal(false);

  onCheckout(): void {
    this.cartDrawerOpen.set(false);
  }
}
