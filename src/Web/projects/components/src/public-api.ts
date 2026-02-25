/* Models */
export type {
  ProductViewModel,
  CategoryViewModel,
  IngredientViewModel,
  CartItemViewModel,
  LoyaltyCardViewModel,
  RewardViewModel,
  ScheduleViewModel,
} from './lib/models';

/* Shared components */
export { ButtonComponent } from './lib/shared/button/button.component';
export { BadgeComponent } from './lib/shared/badge/badge.component';
export { LoadingSpinnerComponent } from './lib/shared/loading-spinner/loading-spinner.component';
export { ToastComponent } from './lib/shared/toast/toast.component';

/* Layout components */
export { HeaderComponent } from './lib/layout/header/header.component';
export { FooterComponent } from './lib/layout/footer/footer.component';
export { NavComponent } from './lib/layout/nav/nav.component';
export { ShellComponent } from './lib/layout/shell/shell.component';

/* Product components */
export { ProductCardComponent } from './lib/product/product-card/product-card.component';
export { ProductListComponent } from './lib/product/product-list/product-list.component';
export { ProductDetailComponent } from './lib/product/product-detail/product-detail.component';
export { formatTag, getTagVariant } from './lib/product/tag-utils';
export type { TagVariant } from './lib/product/tag-utils';

/* Cart components */
export { CartDrawerComponent } from './lib/cart/cart-drawer/cart-drawer.component';
export { CartItemComponent } from './lib/cart/cart-item/cart-item.component';
export { CartSummaryComponent } from './lib/cart/cart-summary/cart-summary.component';

/* Loyalty components */
export { PunchCardComponent } from './lib/loyalty/punch-card/punch-card.component';
export { RewardsListComponent } from './lib/loyalty/rewards-list/rewards-list.component';

/* Location components */
export { TruckMapComponent } from './lib/location/truck-map/truck-map.component';
export { ScheduleCardComponent } from './lib/location/schedule-card/schedule-card.component';
