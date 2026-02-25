import { Component, input, output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductViewModel } from '../../models';
import { BadgeComponent } from '../../shared/badge/badge.component';
import { formatTag, getTagVariant } from '../tag-utils';

@Component({
  selector: 'jf-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, BadgeComponent],
  template: `
    <div
      class="group bg-jf-dark rounded-xl overflow-hidden border border-jf-gold/10 hover:border-jf-gold/30 transition-all cursor-pointer"
      (click)="selected.emit(product())"
    >
      <div class="relative aspect-square overflow-hidden">
        <img
          [src]="product().imageUrl || 'assets/images/placeholder-juice.jpg'"
          [alt]="product().name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        @if (product().isSeasonal) {
          <span class="absolute top-3 left-3 bg-jf-sorrel text-white font-body text-xs font-bold px-2 py-1 rounded">
            SEASONAL
          </span>
        }
      </div>

      <div class="p-4">
        <div class="flex items-start justify-between gap-2">
          <h3 class="font-display text-xl text-jf-coconut tracking-wide">{{ product().name }}</h3>
          <span class="font-body text-jf-gold font-bold text-lg whitespace-nowrap">
            {{ product().price | currency }}
          </span>
        </div>

        <p class="mt-1 font-body text-sm text-gray-400 line-clamp-2">{{ product().description }}</p>

        @if (product().dietaryTags.length > 0) {
          <div class="mt-3 flex flex-wrap gap-1.5">
            @for (tag of product().dietaryTags; track tag) {
              <jf-badge [label]="formatTag(tag)" [variant]="getTagVariant(tag)" />
            }
          </div>
        }

        <button
          class="mt-4 w-full bg-jf-gold text-jf-black font-body font-semibold py-2 rounded-lg hover:bg-jf-mango transition-colors"
          (click)="addToCart($event)"
        >
          Add to Cart
        </button>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  product = input.required<ProductViewModel>();
  selected = output<ProductViewModel>();
  addedToCart = output<ProductViewModel>();

  formatTag = formatTag;
  getTagVariant = getTagVariant;

  addToCart(event: Event): void {
    event.stopPropagation();
    this.addedToCart.emit(this.product());
  }
}
