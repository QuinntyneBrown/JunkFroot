import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'jf-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-jf-black border-t border-jf-gold/20 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span class="font-display text-2xl text-jf-gold tracking-wider">JUNKFROOT</span>
            <p class="mt-3 font-body text-sm text-gray-400">
              Real Juice. Real Culture.<br />Caribbean-inspired fresh juice, rolling through the GTA.
            </p>
          </div>

          <div>
            <h3 class="font-display text-lg text-jf-coconut tracking-wide mb-3">EXPLORE</h3>
            <ul class="space-y-2">
              <li><a routerLink="/menu" class="font-body text-sm text-gray-400 hover:text-jf-gold transition-colors">Menu</a></li>
              <li><a routerLink="/find-us" class="font-body text-sm text-gray-400 hover:text-jf-gold transition-colors">Find the Truck</a></li>
              <li><a routerLink="/loyalty" class="font-body text-sm text-gray-400 hover:text-jf-gold transition-colors">Froot Fam Loyalty</a></li>
              <li><a routerLink="/catering" class="font-body text-sm text-gray-400 hover:text-jf-gold transition-colors">Catering</a></li>
            </ul>
          </div>

          <div>
            <h3 class="font-display text-lg text-jf-coconut tracking-wide mb-3">COMPANY</h3>
            <ul class="space-y-2">
              <li><a routerLink="/about" class="font-body text-sm text-gray-400 hover:text-jf-gold transition-colors">Our Story</a></li>
              <li><a href="mailto:hello&#64;junkfroot.com" class="font-body text-sm text-gray-400 hover:text-jf-gold transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 class="font-display text-lg text-jf-coconut tracking-wide mb-3">FOLLOW THE VIBES</h3>
            <div class="flex gap-4">
              <a href="#" aria-label="Instagram" class="text-gray-400 hover:text-jf-gold transition-colors">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" aria-label="TikTok" class="text-gray-400 hover:text-jf-gold transition-colors">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.15a8.16 8.16 0 005.58 2.2V11.3a4.85 4.85 0 01-3.77-1.84v-.01l-.01-.02a.01.01 0 010 0l.01-.02v-.02a.24.24 0 000-.04 4.83 4.83 0 003.77-2.66z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-gray-800">
          <p class="font-body text-xs text-gray-500 text-center">
            &copy; {{ currentYear }} Junkfroot Inc. All rights reserved. Real Juice. Real Culture. Real Tech.
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
