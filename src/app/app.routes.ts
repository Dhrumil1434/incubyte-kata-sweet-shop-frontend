import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  // TODO: Add sweets and purchases modules when they are created
  // {
  //   path: 'sweets',
  //   loadChildren: () =>
  //     import('./modules/sweets/sweets.module').then(m => m.SweetsModule),
  // },
  // {
  //   path: 'purchases',
  //   loadChildren: () =>
  //     import('./modules/purchases/purchases.module').then(m => m.PurchasesModule),
  // },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
];
