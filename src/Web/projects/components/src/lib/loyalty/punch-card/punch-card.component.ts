import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoyaltyCardViewModel } from '../../models';

@Component({
  selector: 'jf-punch-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-jf-dark rounded-xl p-6 border border-jf-gold/20">
      <div class="text-center mb-6">
        <h2 class="font-accent text-2xl text-jf-gold">Froot Fam</h2>
        <p class="font-body text-sm text-gray-400 mt-1">{{ card().punches }} / {{ card().punchesRequired }} punches</p>
      </div>

      <div class="grid grid-cols-4 gap-3 max-w-xs mx-auto">
        @for (slot of punchSlots(); track $index) {
          <div
            class="aspect-square rounded-full border-2 flex items-center justify-center transition-all"
            [class.border-jf-gold]="slot"
            [class.bg-jf-gold/20]="slot"
            [class.border-gray-600]="!slot"
            [class.bg-transparent]="!slot"
          >
            @if (slot) {
              <svg class="h-6 w-6 text-jf-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            }
          </div>
        }
      </div>

      @if (isRewardReady()) {
        <div class="mt-6 text-center">
          <p class="font-display text-xl text-jf-lime tracking-wide">FREE JUICE UNLOCKED!</p>
          <p class="font-body text-sm text-gray-400 mt-1">Redeem on your next order</p>
        </div>
      } @else {
        <p class="mt-6 text-center font-body text-sm text-gray-400">
          {{ remaining() }} more {{ remaining() === 1 ? 'punch' : 'punches' }} until your free juice!
        </p>
      }

      <div class="mt-6 pt-4 border-t border-jf-gold/10 text-center">
        <p class="font-body text-xs text-gray-500 uppercase tracking-wide">Your Referral Code</p>
        <p class="font-display text-2xl text-jf-mango tracking-widest mt-1">{{ card().referralCode }}</p>
        <p class="font-body text-xs text-gray-400 mt-1">Share & both get $3 off</p>
      </div>
    </div>
  `,
})
export class PunchCardComponent {
  card = input.required<LoyaltyCardViewModel>();

  punchSlots = computed(() => {
    const slots: boolean[] = [];
    for (let i = 0; i < this.card().punchesRequired; i++) {
      slots.push(i < this.card().punches);
    }
    return slots;
  });

  remaining = computed(() => this.card().punchesRequired - this.card().punches);

  isRewardReady = computed(() => this.card().punches >= this.card().punchesRequired);
}
