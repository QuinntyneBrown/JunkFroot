import { Component, input, output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductViewModel } from '../../models';
import { BadgeComponent } from '../../shared/badge/badge.component';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'jf-product-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, BadgeComponent, ButtonComponent],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="relative aspect-square rounded-xl overflow-hidden">
          <img
            [src]="product().imageUrl || 'assets/images/placeholder-juice.jpg'"
            [alt]="product().name"
            class="w-full h-full object-cover"
          />
          @if (product().isSeasonal) {
            <span class="absolute top-4 left-4 bg-jf-sorrel text-white font-body text-sm font-bold px-3 py-1.5 rounded">
              SEASONAL DROP
            </span>
          }
        </div>

        <div class="flex flex-col">
          @if (product().category) {
            <span class="font-body text-sm text-jf-mango uppercase tracking-wide">{{ product().category!.name }}</span>
          }
          <h1 class="font-display text-4xl text-jf-coconut tracking-wider mt-1">{{ product().name }}</h1>
          <span class="font-display text-3xl text-jf-gold mt-2">{{ product().price | currency }}</span>

          <p class="font-body text-gray-300 mt-4 leading-relaxed">{{ product().description }}</p>

          @if (product().inspiration) {
            <div class="mt-6 bg-jf-dark/50 rounded-lg p-4 border-l-4 border-jf-mango">
              <p class="font-accent text-sm text-jf-mango mb-1">Caribbean Inspiration</p>
              <p class="font-body text-sm text-gray-300 italic">{{ product().inspiration }}</p>
            </div>
          }

          @if (product().dietaryTags.length > 0) {
            <div class="mt-4 flex flex-wrap gap-2">
              @for (tag of product().dietaryTags; track tag) {
                <jf-badge [label]="formatTag(tag)" [variant]="getTagVariant(tag)" />
              }
            </div>
          }

          @if (product().ingredients && product().ingredients!.length > 0) {
            <div class="mt-6">
              <h3 class="font-display text-lg text-jf-coconut tracking-wide mb-2">INGREDIENTS</h3>
              <ul class="space-y-1">
                @for (ingredient of product().ingredients!; track ingredient.name) {
                  <li class="font-body text-sm" [class.text-jf-sorrel]="ingredient.isAllergen" [class.text-gray-400]="!ingredient.isAllergen">
                    {{ ingredient.name }}
                    @if (ingredient.isAllergen) {
                      <span class="text-xs">(allergen{{ ingredient.allergenType ? ': ' + ingredient.allergenType : '' }})</span>
                    }
                  </li>
                }
              </ul>
            </div>
          }

          <div class="mt-8">
            <jf-button variant="primary" size="lg" (clicked)="addedToCart.emit(product())">
              Add to Cart — {{ product().price | currency }}
            </jf-button>
          </div>

          <button
            class="mt-3 font-body text-sm text-gray-400 hover:text-jf-gold transition-colors"
            (click)="backClicked.emit()"
          >
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProductDetailComponent {
  product = input.required<ProductViewModel>();
  addedToCart = output<ProductViewModel>();
  backClicked = output<void>();

  formatTag(tag: string): string {
    const labels: Record<string, string> = {
      Vegan: 'Vegan',
      GlutenFree: 'GF',
      NutFree: 'NF',
      DairyFree: 'DF',
    };
    return labels[tag] ?? tag;
  }

  getTagVariant(tag: string): 'vegan' | 'gf' | 'nf' | 'df' | 'default' {
    const variants: Record<string, 'vegan' | 'gf' | 'nf' | 'df' | 'default'> = {
      Vegan: 'vegan',
      GlutenFree: 'gf',
      NutFree: 'nf',
      DairyFree: 'df',
    };
    return variants[tag] ?? 'default';
  }
}
