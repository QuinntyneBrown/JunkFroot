import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductViewModel, CategoryViewModel } from '../../models';
import { ProductCardComponent } from '../product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'jf-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, LoadingSpinnerComponent],
  template: `
    @if (loading()) {
      <jf-loading-spinner size="lg" />
    } @else {
      @if (categories().length > 0) {
        <div class="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          <button
            class="px-4 py-2 rounded-full font-body text-sm whitespace-nowrap transition-colors"
            [class.bg-jf-gold]="!selectedCategory()"
            [class.text-jf-black]="!selectedCategory()"
            [class.bg-jf-dark]="selectedCategory()"
            [class.text-jf-coconut]="selectedCategory()"
            (click)="selectedCategory.set(null)"
          >
            All
          </button>
          @for (category of categories(); track category.id) {
            <button
              class="px-4 py-2 rounded-full font-body text-sm whitespace-nowrap transition-colors"
              [class.bg-jf-gold]="selectedCategory()?.id === category.id"
              [class.text-jf-black]="selectedCategory()?.id === category.id"
              [class.bg-jf-dark]="selectedCategory()?.id !== category.id"
              [class.text-jf-coconut]="selectedCategory()?.id !== category.id"
              (click)="selectedCategory.set(category)"
            >
              {{ category.name }}
            </button>
          }
        </div>
      }

      @if (filteredProducts().length === 0) {
        <div class="text-center py-16">
          <p class="font-body text-gray-400 text-lg">No products found.</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          @for (product of filteredProducts(); track product.id) {
            <jf-product-card
              [product]="product"
              (selected)="productSelected.emit($event)"
              (addedToCart)="productAddedToCart.emit($event)"
            />
          }
        </div>
      }
    }
  `,
})
export class ProductListComponent {
  products = input.required<ProductViewModel[]>();
  categories = input<CategoryViewModel[]>([]);
  loading = input(false);
  productSelected = output<ProductViewModel>();
  productAddedToCart = output<ProductViewModel>();

  selectedCategory = signal<CategoryViewModel | null>(null);

  filteredProducts = computed(() => {
    const category = this.selectedCategory();
    if (!category) return this.products();
    return this.products().filter(p => p.category?.id === category.id);
  });
}
