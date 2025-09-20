import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { SweetManagementComponent } from './components/sweet-management/sweet-management.component';
import { OrderManagementComponent } from './components/order-management/order-management.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';

const routes = [
  {
    path: '',
    component: AdminDashboardComponent,
  },
  {
    path: 'users',
    component: UserManagementComponent,
  },
  {
    path: 'sweets',
    component: SweetManagementComponent,
  },
  {
    path: 'orders',
    component: OrderManagementComponent,
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AdminModule {}
