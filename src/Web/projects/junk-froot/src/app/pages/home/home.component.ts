import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '@junkfroot/components';
import { MenuStore } from '../../store/menu.store';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  template: `
    <section class="relative bg-jf-black overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div class="text-center">
          <h1 class="font-accent text-5xl md:text-7xl text-jf-gold leading-tight">
            Real Juice.<br />Real Culture.
          </h1>
          <p class="mt-6 font-body text-xl text-gray-300 max-w-2xl mx-auto">
            Caribbean-inspired fresh juice, rolling through the Greater Toronto Area.
            Bold flavours, island vibes, zero compromise.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              routerLink="/menu"
              class="inline-flex items-center justify-center bg-jf-gold text-jf-black font-body font-semibold px-8 py-3.5 rounded-lg hover:bg-jf-mango transition-colors text-lg"
            >
              View the Menu
            </a>
            <a
              routerLink="/find-us"
              class="inline-flex items-center justify-center border-2 border-jf-gold text-jf-gold font-body font-semibold px-8 py-3.5 rounded-lg hover:bg-jf-gold hover:text-jf-black transition-colors text-lg"
            >
              Find the Truck
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 class="font-display text-3xl text-jf-coconut tracking-wide text-center mb-8">FEATURED DROPS</h2>
      @if (menuStore.featuredProducts().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (product of menuStore.featuredProducts().slice(0, 4); track product.id) {
            <jf-product-card
              [product]="product"
              (addedToCart)="cartStore.addItem($event.id, 1)"
            />
          }
        </div>
      }
      <div class="text-center mt-8">
        <a routerLink="/menu" class="font-body text-jf-gold hover:text-jf-mango transition-colors">
          See Full Menu →
        </a>
      </div>
    </section>

    <section class="bg-jf-dark py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="font-accent text-3xl text-jf-mango mb-4">Join the Froot Fam</h2>
        <p class="font-body text-gray-300 max-w-xl mx-auto">
          8 punches = 1 free juice. Birthday smoothies. Referral discounts.
          It pays to be family.
        </p>
        <a
          routerLink="/loyalty"
          class="inline-block mt-6 bg-jf-gold text-jf-black font-body font-semibold px-6 py-3 rounded-lg hover:bg-jf-mango transition-colors"
        >
          Learn More
        </a>
      </div>
    </section>
  `,
})
export class HomeComponent implements OnInit {
  menuStore = inject(MenuStore);
  cartStore = inject(CartStore);

  ngOnInit(): void {
    this.menuStore.loadProducts();
  }
}
