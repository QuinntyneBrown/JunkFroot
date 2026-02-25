import { Component, inject, OnInit, signal, input } from '@angular/core';
import { Router } from '@angular/router';
import { ProductDetailComponent, ProductViewModel, LoadingSpinnerComponent } from '@junkfroot/components';
import { CatalogApiService } from '@junkfroot/api';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ProductDetailComponent, LoadingSpinnerComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      @if (loading()) {
        <jf-loading-spinner size="lg" />
      } @else if (product()) {
        <jf-product-detail
          [product]="product()!"
          (addedToCart)="onAddToCart($event)"
          (backClicked)="onBack()"
        />
      }
    </div>
  `,
})
export class ProductComponent implements OnInit {
  slug = input.required<string>();

  private readonly catalogApi = inject(CatalogApiService);
  private readonly cartStore = inject(CartStore);
  private readonly router = inject(Router);

  product = signal<ProductViewModel | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.catalogApi.getProduct(this.slug()).subscribe({
      next: (p) => {
        this.product.set({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          inspiration: p.inspiration,
          price: p.price,
          imageUrl: p.imageUrl,
          isSeasonal: p.isSeasonal,
          dietaryTags: p.dietaryTags,
          category: p.category ? {
            id: p.category.id,
            name: p.category.name,
            slug: p.category.slug,
            description: p.category.description,
          } : undefined,
          ingredients: p.ingredients?.map((i) => ({
            name: i.ingredient.name,
            isAllergen: i.ingredient.isAllergen,
            allergenType: i.ingredient.allergenType,
          })),
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onAddToCart(product: ProductViewModel): void {
    this.cartStore.addItem(product.id, 1);
  }

  onBack(): void {
    this.router.navigate(['/menu']);
  }
}
