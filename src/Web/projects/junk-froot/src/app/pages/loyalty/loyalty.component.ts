import { Component, inject, OnInit, signal } from '@angular/core';
import { PunchCardComponent, RewardsListComponent, LoyaltyCardViewModel, RewardViewModel } from '@junkfroot/components';
import { LoyaltyApiService } from '@junkfroot/api';

@Component({
  selector: 'app-loyalty',
  standalone: true,
  imports: [PunchCardComponent, RewardsListComponent],
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="font-display text-4xl text-jf-coconut tracking-wider text-center mb-2">FROOT FAM</h1>
      <p class="font-body text-center text-gray-400 mb-8">Your loyalty, rewarded.</p>

      @if (card()) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <jf-punch-card [card]="card()!" />
          <jf-rewards-list [rewards]="rewards()" (redeemed)="onRedeem($event)" />
        </div>
      }

      <div class="mt-12 bg-jf-dark rounded-xl p-6 border border-jf-gold/10">
        <h2 class="font-display text-xl text-jf-coconut tracking-wide mb-4">HOW IT WORKS</h2>
        <ul class="space-y-3 font-body text-gray-300">
          <li class="flex items-start gap-3">
            <span class="text-jf-gold font-bold">1.</span>
            <span>Order any drink (minimum $8 spend) and earn a punch</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-jf-gold font-bold">2.</span>
            <span>Collect 8 punches to unlock a free regular juice</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-jf-gold font-bold">3.</span>
            <span>Get a free smoothie on your birthday month</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-jf-gold font-bold">4.</span>
            <span>Refer a friend — you both get $3 off your next order</span>
          </li>
        </ul>
      </div>
    </div>
  `,
})
export class LoyaltyComponent implements OnInit {
  private readonly loyaltyApi = inject(LoyaltyApiService);

  card = signal<LoyaltyCardViewModel | null>(null);
  rewards = signal<RewardViewModel[]>([]);

  ngOnInit(): void {
    this.loyaltyApi.getCard().subscribe({
      next: (c) => {
        this.card.set({
          punches: c.punchCount,
          punchesRequired: c.totalPunches,
          referralCode: c.referralCode,
        });
      },
    });

    this.loyaltyApi.getRewards().subscribe({
      next: (r) => {
        this.rewards.set(
          r.map((reward) => ({
            id: reward.id,
            name: reward.name,
            description: reward.description,
            isRedeemed: !reward.isActive,
          }))
        );
      },
    });
  }

  onRedeem(rewardId: string): void {
    this.loyaltyApi.redeemReward(rewardId).subscribe({
      next: () => {
        this.rewards.update((rewards) =>
          rewards.map((r) => (r.id === rewardId ? { ...r, isRedeemed: true } : r))
        );
      },
    });
  }
}
