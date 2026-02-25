import { Injectable, inject, signal, computed } from '@angular/core';
import { OrderApiService, CartItem } from '@junkfroot/api';

interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly orderApi = inject(OrderApiService);

  private readonly state = signal<CartState>({
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    loading: false,
  });

  readonly items = computed(() => this.state().items);
  readonly subtotal = computed(() => this.state().subtotal);
  readonly tax = computed(() => this.state().tax);
  readonly total = computed(() => this.state().total);
  readonly loading = computed(() => this.state().loading);
  readonly itemCount = computed(() =>
    this.state().items.reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly isEmpty = computed(() => this.state().items.length === 0);

  loadCart(): void {
    this.state.update((s) => ({ ...s, loading: true }));
    this.orderApi.getCart().subscribe({
      next: (cart) => {
        this.state.set({
          items: cart.items,
          subtotal: cart.subtotal,
          tax: cart.tax,
          total: cart.total,
          loading: false,
        });
      },
      error: () => {
        this.state.update((s) => ({ ...s, loading: false }));
      },
    });
  }

  addItem(productId: string, quantity: number): void {
    this.orderApi.addToCart({ productId, quantity }).subscribe({
      next: (cart) => {
        this.state.set({
          items: cart.items,
          subtotal: cart.subtotal,
          tax: cart.tax,
          total: cart.total,
          loading: false,
        });
      },
    });
  }

  updateQuantity(itemId: string, quantity: number): void {
    this.orderApi.updateCartItem(itemId, quantity).subscribe({
      next: (cart) => {
        this.state.set({
          items: cart.items,
          subtotal: cart.subtotal,
          tax: cart.tax,
          total: cart.total,
          loading: false,
        });
      },
    });
  }

  removeItem(itemId: string): void {
    this.orderApi.removeCartItem(itemId).subscribe({
      next: (cart) => {
        this.state.set({
          items: cart.items,
          subtotal: cart.subtotal,
          tax: cart.tax,
          total: cart.total,
          loading: false,
        });
      },
    });
  }
}
