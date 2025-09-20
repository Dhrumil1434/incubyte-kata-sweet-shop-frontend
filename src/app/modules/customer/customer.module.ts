import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { SweetShopComponent } from './components/sweet-shop/sweet-shop.component';
import { MyPurchasesComponent } from './components/my-purchases/my-purchases.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes = [
  {
    path: '',
    component: CustomerDashboardComponent,
  },
  {
    path: 'shop',
    component: SweetShopComponent,
  },
  {
    path: 'purchases',
    component: MyPurchasesComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class CustomerModule {}
