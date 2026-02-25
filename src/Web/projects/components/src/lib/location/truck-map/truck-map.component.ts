import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jf-truck-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-jf-dark rounded-xl overflow-hidden border border-jf-gold/10">
      <div class="aspect-video bg-jf-black/50 flex items-center justify-center relative">
        <div
          class="w-full h-full bg-gray-800 flex items-center justify-center"
          [attr.data-lat]="latitude()"
          [attr.data-lng]="longitude()"
        >
          <div class="text-center">
            <svg class="h-12 w-12 text-jf-gold mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p class="font-body text-sm text-gray-400">Map loads here</p>
            @if (latitude() && longitude()) {
              <p class="font-body text-xs text-gray-500 mt-1">{{ latitude() }}, {{ longitude() }}</p>
            }
          </div>
        </div>

        @if (isOperating()) {
          <div class="absolute top-4 left-4 flex items-center gap-2 bg-jf-dark/90 px-3 py-1.5 rounded-full">
            <span class="h-2.5 w-2.5 rounded-full bg-jf-lime animate-pulse"></span>
            <span class="font-body text-sm text-jf-lime font-semibold">LIVE</span>
          </div>
        }
      </div>

      @if (address()) {
        <div class="p-4">
          <div class="flex items-start gap-3">
            <svg class="h-5 w-5 text-jf-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p class="font-body font-semibold text-jf-coconut">{{ address() }}</p>
              @if (estimatedClose()) {
                <p class="font-body text-sm text-gray-400 mt-0.5">Open until {{ estimatedClose() }}</p>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class TruckMapComponent {
  latitude = input(0);
  longitude = input(0);
  address = input('');
  isOperating = input(false);
  estimatedClose = input('');
}
