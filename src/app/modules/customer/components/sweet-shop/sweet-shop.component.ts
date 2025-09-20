import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sweet-shop',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sweet-shop">
      <h2>Sweet Shop</h2>
      <p>Sweet shop functionality coming soon...</p>
    </div>
  `,
  styles: [
    `
      .sweet-shop {
        padding: 2rem;
      }
    `,
  ],
})
export class SweetShopComponent {}
