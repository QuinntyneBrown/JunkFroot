export interface LoyaltyCard {
  id: string;
  userId: string;
  punches: Punch[];
  punchCount: number;
  totalPunches: number;
  rewardsEarned: number;
  referralCode: string;
  createdAt: string;
}

export interface Punch {
  id: string;
  loyaltyCardId: string;
  orderId: string;
  punchedAt: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  punchesRequired: number;
  isActive: boolean;
}

export interface RewardRedemption {
  id: string;
  rewardId: string;
  loyaltyCardId: string;
  redeemedAt: string;
  reward: Reward;
}

export interface Referral {
  id: string;
  referrerUserId: string;
  refereeUserId: string;
  referralCode: string;
  discountAmount: number;
  appliedAt: string | null;
  createdAt: string;
}

export interface ApplyReferralRequest {
  referralCode: string;
}
