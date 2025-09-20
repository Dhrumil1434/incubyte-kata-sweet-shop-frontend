import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-management">
      <h2>User Management</h2>
      <p>User management functionality coming soon...</p>
    </div>
  `,
  styles: [
    `
      .user-management {
        padding: 2rem;
      }
    `,
  ],
})
export class UserManagementComponent {}
