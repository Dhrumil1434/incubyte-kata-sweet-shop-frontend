import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { SweetShopComponent } from './components/sweet-shop/sweet-shop.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
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
    path: 'orders',
    component: MyOrdersComponent,
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
