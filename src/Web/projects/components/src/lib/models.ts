export interface ProductViewModel {
  id: string;
  name: string;
  slug: string;
  description: string;
  inspiration: string;
  price: number;
  imageUrl: string;
  isSeasonal: boolean;
  dietaryTags: string[];
  category?: CategoryViewModel;
  ingredients?: IngredientViewModel[];
}

export interface CategoryViewModel {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface IngredientViewModel {
  name: string;
  isAllergen: boolean;
  allergenType?: string;
}

export interface CartItemViewModel {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface LoyaltyCardViewModel {
  punches: number;
  punchesRequired: number;
  referralCode: string;
}

export interface RewardViewModel {
  id: string;
  name: string;
  description: string;
  isRedeemed: boolean;
  expiresAt?: string;
}

export interface ScheduleViewModel {
  dayOfWeek: number;
  location: string;
  address: string;
  openTime: string;
  closeTime: string;
  isActive: boolean;
}
