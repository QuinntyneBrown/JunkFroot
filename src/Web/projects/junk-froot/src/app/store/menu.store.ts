import { Injectable, inject, signal, computed } from '@angular/core';
import { CatalogApiService, Product, Category } from '@junkfroot/api';
import type { ProductViewModel, CategoryViewModel } from '@junkfroot/components';

function toProductViewModel(p: Product): ProductViewModel {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    inspiration: p.inspiration,
    price: p.price,
    imageUrl: p.imageUrl,
    isSeasonal: p.isSeasonal,
    dietaryTags: p.dietaryTags,
    category: p.category
      ? { id: p.category.id, name: p.category.name, slug: p.category.slug, description: p.category.description }
      : undefined,
    ingredients: p.ingredients?.map((i) => ({
      name: i.ingredient.name,
      isAllergen: i.ingredient.isAllergen,
    })),
  };
}

function toCategoryViewModel(c: Category): CategoryViewModel {
  return { id: c.id, name: c.name, slug: c.slug, description: c.description };
}

interface MenuState {
  products: Product[];
  categories: Category[];
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class MenuStore {
  private readonly catalogApi = inject(CatalogApiService);

  private readonly state = signal<MenuState>({
    products: [],
    categories: [],
    loading: false,
  });

  readonly products = computed(() => this.state().products.map(toProductViewModel));
  readonly categories = computed(() => this.state().categories.map(toCategoryViewModel));
  readonly loading = computed(() => this.state().loading);
  readonly featuredProducts = computed(() =>
    this.state()
      .products.filter((p) => p.isSeasonal || p.isActive)
      .map(toProductViewModel)
  );

  loadProducts(): void {
    this.state.update((s) => ({ ...s, loading: true }));
    this.catalogApi.getProducts().subscribe({
      next: (products) => {
        this.state.update((s) => ({ ...s, products, loading: false }));
      },
      error: () => {
        this.state.update((s) => ({ ...s, loading: false }));
      },
    });
  }

  loadCategories(): void {
    this.catalogApi.getCategories().subscribe({
      next: (categories) => {
        this.state.update((s) => ({ ...s, categories }));
      },
    });
  }
}
