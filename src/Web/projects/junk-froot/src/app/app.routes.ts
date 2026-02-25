import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./pages/menu/menu.component').then((m) => m.MenuComponent),
  },
  {
    path: 'menu/:slug',
    loadComponent: () =>
      import('./pages/product/product.component').then((m) => m.ProductComponent),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((m) => m.CartPageComponent),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.component').then((m) => m.CheckoutComponent),
  },
  {
    path: 'find-us',
    loadComponent: () =>
      import('./pages/find-us/find-us.component').then((m) => m.FindUsComponent),
  },
  {
    path: 'loyalty',
    loadComponent: () =>
      import('./pages/loyalty/loyalty.component').then((m) => m.LoyaltyComponent),
  },
  {
    path: 'catering',
    loadComponent: () =>
      import('./pages/catering/catering.component').then((m) => m.CateringComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'account',
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/account/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/account/orders.component').then((m) => m.OrdersComponent),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/account/login.component').then((m) => m.LoginComponent),
  },
];
