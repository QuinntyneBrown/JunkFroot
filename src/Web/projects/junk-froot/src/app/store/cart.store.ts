import { Injectable, inject, signal, computed } from '@angular/core';
import { OrderApiService, CartItem } from '@junkfroot/api';
import type { CartItemViewModel } from '@junkfroot/components';

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
  readonly itemViewModels = computed<CartItemViewModel[]>(() =>
    this.state().items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      productImageUrl: '',
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.unitPrice * item.quantity,
    }))
  );
  readonly subtotal = computed(() => this.state().subtotal);
  readonly tax = computed(() => this.state().tax);
  readonly total = computed(() => this.state().total);
  readonly loading = computed(() => this.state().loading);
  readonly itemCount = computed(() =>
    this.state().items.reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly isEmpty = computed(() => this.state().items.length === 0);

  private deriveState(cart: { items: CartItem[]; total: number }): CartState {
    const subtotal = cart.total;
    const tax = +(subtotal * 0.13).toFixed(2);
    return { items: cart.items, subtotal, tax, total: +(subtotal + tax).toFixed(2), loading: false };
  }

  loadCart(): void {
    this.state.update((s) => ({ ...s, loading: true }));
    this.orderApi.getCart().subscribe({
      next: (cart) => this.state.set(this.deriveState(cart)),
      error: () => this.state.update((s) => ({ ...s, loading: false })),
    });
  }

  addItem(productId: string, quantity: number): void {
    this.orderApi.addToCart({ productId, quantity }).subscribe({
      next: (cart) => this.state.set(this.deriveState(cart)),
    });
  }

  updateQuantity(itemId: string, quantity: number): void {
    this.orderApi.updateCartItem(itemId, { quantity }).subscribe({
      next: (cart) => this.state.set(this.deriveState(cart)),
    });
  }

  removeItem(itemId: string): void {
    this.orderApi.removeCartItem(itemId).subscribe({
      next: (cart) => this.state.set(this.deriveState(cart)),
    });
  }
}
