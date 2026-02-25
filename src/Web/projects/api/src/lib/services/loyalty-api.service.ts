import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import {
  ApplyReferralRequest,
  LoyaltyCard,
  Punch,
  Referral,
  Reward,
  RewardRedemption,
} from '../models/loyalty.model';

@Injectable({ providedIn: 'root' })
export class LoyaltyApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getCard(): Observable<LoyaltyCard> {
    return this.http.get<LoyaltyCard>(`${this.baseUrl}/api/loyalty/card`);
  }

  getCardHistory(): Observable<Punch[]> {
    return this.http.get<Punch[]>(`${this.baseUrl}/api/loyalty/card/history`);
  }

  getRewards(): Observable<Reward[]> {
    return this.http.get<Reward[]>(`${this.baseUrl}/api/loyalty/rewards`);
  }

  redeemReward(rewardId: string): Observable<RewardRedemption> {
    return this.http.post<RewardRedemption>(
      `${this.baseUrl}/api/loyalty/rewards/${rewardId}/redeem`,
      {}
    );
  }

  getReferralCode(): Observable<Referral> {
    return this.http.get<Referral>(`${this.baseUrl}/api/loyalty/referral/code`);
  }

  applyReferral(request: ApplyReferralRequest): Observable<Referral> {
    return this.http.post<Referral>(`${this.baseUrl}/api/loyalty/referral/apply`, request);
  }
}
