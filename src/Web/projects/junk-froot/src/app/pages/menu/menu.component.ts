import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductListComponent, ProductViewModel } from '@junkfroot/components';
import { MenuStore } from '../../store/menu.store';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ProductListComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="font-display text-4xl text-jf-coconut tracking-wider text-center mb-8">OUR MENU</h1>
      <jf-product-list
        [products]="menuStore.products()"
        [categories]="menuStore.categories()"
        [loading]="menuStore.loading()"
        (productSelected)="onProductSelected($event)"
        (productAddedToCart)="onAddToCart($event)"
      />
    </div>
  `,
})
export class MenuComponent implements OnInit {
  menuStore = inject(MenuStore);
  cartStore = inject(CartStore);
  private router = inject(Router);

  ngOnInit(): void {
    this.menuStore.loadProducts();
    this.menuStore.loadCategories();
  }

  onProductSelected(product: ProductViewModel): void {
    this.router.navigate(['/menu', product.slug]);
  }

  onAddToCart(product: ProductViewModel): void {
    this.cartStore.addItem(product.id, 1);
  }
}
