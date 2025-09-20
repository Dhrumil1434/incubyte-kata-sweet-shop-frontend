import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-management">
      <h2>Order Management</h2>
      <p>Order management functionality coming soon...</p>
    </div>
  `,
  styles: [
    `
      .order-management {
        padding: 2rem;
      }
    `,
  ],
})
export class OrderManagementComponent {}
