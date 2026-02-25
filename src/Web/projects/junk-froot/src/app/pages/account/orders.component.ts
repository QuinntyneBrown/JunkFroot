import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderApiService, Order } from '@junkfroot/api';
import { LoadingSpinnerComponent } from '@junkfroot/components';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="font-display text-4xl text-jf-coconut tracking-wider mb-8">ORDER HISTORY</h1>

      @if (loading()) {
        <jf-loading-spinner size="lg" />
      } @else if (orders().length === 0) {
        <div class="text-center py-16">
          <p class="font-body text-xl text-gray-400">No orders yet</p>
          <a routerLink="/menu" class="font-body text-jf-gold hover:text-jf-mango transition-colors mt-2 inline-block">
            Browse the menu →
          </a>
        </div>
      } @else {
        <div class="space-y-4">
          @for (order of orders(); track order.id) {
            <div class="bg-jf-dark rounded-xl p-6 border border-jf-gold/10">
              <div class="flex items-center justify-between mb-3">
                <span class="font-body text-sm text-gray-400">{{ order.createdAt | date:'medium' }}</span>
                <span
                  class="px-3 py-1 rounded-full text-xs font-body font-semibold"
                  [class.bg-jf-lime/20]="order.status === 'Completed'"
                  [class.text-jf-lime]="order.status === 'Completed'"
                  [class.bg-jf-mango/20]="order.status === 'Preparing' || order.status === 'Ready'"
                  [class.text-jf-mango]="order.status === 'Preparing' || order.status === 'Ready'"
                  [class.bg-jf-gold/20]="order.status === 'Confirmed' || order.status === 'Pending'"
                  [class.text-jf-gold]="order.status === 'Confirmed' || order.status === 'Pending'"
                  [class.bg-jf-sorrel/20]="order.status === 'Cancelled'"
                  [class.text-jf-sorrel]="order.status === 'Cancelled'"
                >
                  {{ order.status }}
                </span>
              </div>
              <div class="space-y-1">
                @for (item of order.items; track item.id) {
                  <div class="flex justify-between font-body text-sm text-gray-300">
                    <span>{{ item.productName }} x{{ item.quantity }}</span>
                    <span>{{ item.lineTotal | currency }}</span>
                  </div>
                }
              </div>
              <div class="mt-3 pt-3 border-t border-jf-gold/10 flex justify-between">
                <span class="font-body font-semibold text-jf-coconut">Total</span>
                <span class="font-body font-bold text-jf-gold">{{ order.total | currency }}</span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class OrdersComponent implements OnInit {
  private readonly orderApi = inject(OrderApiService);

  orders = signal<Order[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.orderApi.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
