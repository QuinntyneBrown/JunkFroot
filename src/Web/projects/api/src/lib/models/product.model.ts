export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  inspiration: string;
  price: number;
  categoryId: string;
  category: Category;
  ingredients: ProductIngredient[];
  dietaryTags: DietaryTag[];
  imageUrl: string;
  isSeasonal: boolean;
  isActive: boolean;
  availableFrom: string | null;
  availableUntil: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

export interface Ingredient {
  id: string;
  name: string;
  isAllergen: boolean;
}

export interface ProductIngredient {
  productId: string;
  ingredientId: string;
  ingredient: Ingredient;
  quantity: string;
}

export enum DietaryTag {
  Vegan = 'Vegan',
  GlutenFree = 'GF',
  NutFree = 'NF',
  DairyFree = 'DF',
}

export interface ComboOffer {
  id: string;
  name: string;
  description: string;
  productIds: string[];
  originalPrice: number;
  comboPrice: number;
  isActive: boolean;
  availableFrom: string | null;
  availableUntil: string | null;
}

export interface SeasonalDrop {
  id: string;
  name: string;
  description: string;
  products: Product[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}
