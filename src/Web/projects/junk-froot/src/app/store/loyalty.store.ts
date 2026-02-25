import { Injectable, inject, signal, computed } from '@angular/core';
import { LoyaltyApiService, LoyaltyCard, Reward } from '@junkfroot/api';
import type { LoyaltyCardViewModel, RewardViewModel } from '@junkfroot/components';

interface LoyaltyState {
  card: LoyaltyCard | null;
  rewards: Reward[];
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class LoyaltyStore {
  private readonly loyaltyApi = inject(LoyaltyApiService);

  private readonly state = signal<LoyaltyState>({
    card: null,
    rewards: [],
    loading: false,
  });

  readonly loading = computed(() => this.state().loading);

  readonly card = computed<LoyaltyCardViewModel | null>(() => {
    const c = this.state().card;
    if (!c) return null;
    return {
      punches: c.punchCount,
      punchesRequired: c.totalPunches,
      referralCode: c.referralCode,
    };
  });

  readonly rewards = computed<RewardViewModel[]>(() =>
    this.state().rewards.map((reward) => ({
      id: reward.id,
      name: reward.name,
      description: reward.description,
      isRedeemed: !reward.isActive,
    }))
  );

  loadCard(): void {
    this.state.update((s) => ({ ...s, loading: true }));
    this.loyaltyApi.getCard().subscribe({
      next: (card) => {
        this.state.update((s) => ({ ...s, card, loading: false }));
      },
      error: () => {
        this.state.update((s) => ({ ...s, loading: false }));
      },
    });
  }

  loadRewards(): void {
    this.loyaltyApi.getRewards().subscribe({
      next: (rewards) => {
        this.state.update((s) => ({ ...s, rewards }));
      },
    });
  }

  redeemReward(rewardId: string): void {
    this.loyaltyApi.redeemReward(rewardId).subscribe({
      next: () => {
        this.state.update((s) => ({
          ...s,
          rewards: s.rewards.map((r) =>
            r.id === rewardId ? { ...r, isActive: false } : r
          ),
        }));
      },
    });
  }
}
