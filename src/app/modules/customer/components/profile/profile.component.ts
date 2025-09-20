import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile">
      <h2>My Profile</h2>
      <p>Profile management functionality coming soon...</p>
    </div>
  `,
  styles: [
    `
      .profile {
        padding: 2rem;
      }
    `,
  ],
})
export class ProfileComponent {}
