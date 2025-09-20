import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { SweetManagementComponent } from './components/sweet-management/sweet-management.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { PurchaseManagementComponent } from './components/purchase-management/purchase-management.component';
import { CorsTestComponent } from './components/cors-test/cors-test.component';
import { BackendTestComponent } from './components/backend-test/backend-test.component';
import { OrderManagementComponent } from './components/order-management/order-management.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';

const routes = [
  {
    path: '',
    component: AdminDashboardComponent,
  },
  {
    path: 'sweets',
    component: SweetManagementComponent,
  },
  {
    path: 'categories',
    component: CategoryManagementComponent,
  },
  {
    path: 'users',
    component: UserManagementComponent,
  },
  {
    path: 'purchases',
    component: PurchaseManagementComponent,
  },
  {
    path: 'cors-test',
    component: CorsTestComponent,
  },
  {
    path: 'backend-test',
    component: BackendTestComponent,
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
