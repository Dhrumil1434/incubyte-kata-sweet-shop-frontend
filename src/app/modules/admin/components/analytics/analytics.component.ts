import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics">
      <h2>Analytics</h2>
      <p>Analytics functionality coming soon...</p>
    </div>
  `,
  styles: [
    `
      .analytics {
        padding: 2rem;
      }
    `,
  ],
})
export class AnalyticsComponent {}
