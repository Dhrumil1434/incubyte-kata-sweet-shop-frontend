import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="my-orders">
      <h2>My Orders</h2>
      <p>Order history functionality coming soon...</p>
    </div>
  `,
  styles: [
    `
      .my-orders {
        padding: 2rem;
      }
    `,
  ],
})
export class MyOrdersComponent {}
