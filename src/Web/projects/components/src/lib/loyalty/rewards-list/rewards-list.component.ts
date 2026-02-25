import { Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RewardViewModel } from '../../models';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'jf-rewards-list',
  standalone: true,
  imports: [CommonModule, DatePipe, ButtonComponent],
  template: `
    <div class="space-y-4">
      <h3 class="font-display text-xl text-jf-coconut tracking-wide">YOUR REWARDS</h3>

      @if (rewards().length === 0) {
        <div class="text-center py-8">
          <p class="font-body text-gray-400">No rewards yet. Keep collecting punches!</p>
        </div>
      } @else {
        @for (reward of rewards(); track reward.id) {
          <div
            class="bg-jf-dark rounded-lg p-4 border border-jf-gold/10 flex items-center justify-between"
            [class.opacity-50]="reward.isRedeemed"
          >
            <div>
              <h4 class="font-body font-semibold text-jf-coconut">{{ reward.name }}</h4>
              <p class="font-body text-sm text-gray-400 mt-0.5">{{ reward.description }}</p>
              @if (reward.expiresAt) {
                <p class="font-body text-xs text-jf-mango mt-1">
                  Expires {{ reward.expiresAt | date:'mediumDate' }}
                </p>
              }
            </div>

            @if (reward.isRedeemed) {
              <span class="font-body text-sm text-gray-500 italic">Redeemed</span>
            } @else {
              <jf-button variant="secondary" size="sm" (clicked)="redeemed.emit(reward.id)">
                Redeem
              </jf-button>
            }
          </div>
        }
      }
    </div>
  `,
})
export class RewardsListComponent {
  rewards = input.required<RewardViewModel[]>();
  redeemed = output<string>();
}
