import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sweet-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sweet-management">
      <h2>Sweet Management</h2>
      <p>Sweet management functionality coming soon...</p>
    </div>
  `,
  styles: [
    `
      .sweet-management {
        padding: 2rem;
      }
    `,
  ],
})
export class SweetManagementComponent {}
