import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';

export interface SidebarItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    DividerModule,
    BadgeModule,
  ],
  template: `
    <div class="sidebar" [class.collapsed]="collapsed">
      <!-- Sidebar Header -->
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <i class="pi pi-heart text-primary text-2xl"></i>
          <span *ngIf="!collapsed" class="brand-text">Kata Sweet Shop</span>
        </div>
        <p-button
          icon="pi pi-bars"
          severity="secondary"
          [text]="true"
          size="small"
          (onClick)="toggleCollapse()"
          class="collapse-btn"
        >
        </p-button>
      </div>

      <p-divider></p-divider>

      <!-- Navigation Items -->
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h4 *ngIf="!collapsed" class="nav-section-title">Shop</h4>
          <div class="nav-items">
            <a
              *ngFor="let item of shopItems"
              [routerLink]="item.route"
              routerLinkActive="active"
              class="nav-item"
              [class.collapsed]="collapsed"
              (click)="onItemClick(item)"
            >
              <i [class]="item.icon" class="nav-icon"></i>
              <span *ngIf="!collapsed" class="nav-label">{{ item.label }}</span>
              <p-badge
                *ngIf="item.badge && item.badge > 0 && !collapsed"
                [value]="item.badge"
                severity="danger"
                class="nav-badge"
              >
              </p-badge>
            </a>
          </div>
        </div>

        <p-divider *ngIf="!collapsed"></p-divider>

        <div class="nav-section">
          <h4 *ngIf="!collapsed" class="nav-section-title">Account</h4>
          <div class="nav-items">
            <a
              *ngFor="let item of accountItems"
              [routerLink]="item.route"
              routerLinkActive="active"
              class="nav-item"
              [class.collapsed]="collapsed"
              (click)="onItemClick(item)"
            >
              <i [class]="item.icon" class="nav-icon"></i>
              <span *ngIf="!collapsed" class="nav-label">{{ item.label }}</span>
            </a>
          </div>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <div class="user-info" *ngIf="!collapsed">
          <div class="user-avatar">
            <i class="pi pi-user"></i>
          </div>
          <div class="user-details">
            <div class="user-name">{{ userName }}</div>
            <div class="user-email">{{ userEmail }}</div>
          </div>
        </div>
        <p-button
          icon="pi pi-sign-out"
          severity="danger"
          [text]="true"
          size="small"
          (onClick)="onLogout()"
          [class]="collapsed ? 'w-full' : ''"
          class="logout-btn"
        >
          <span *ngIf="!collapsed" class="ml-2">Logout</span>
        </p-button>
      </div>
    </div>
  `,
  styles: [
    `
      .sidebar {
        width: 280px;
        height: 100vh;
        background: var(--color-bg);
        border-right: 1px solid var(--color-neutral-300);
        display: flex;
        flex-direction: column;
        transition: width 0.3s ease;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1000;
      }

      .sidebar.collapsed {
        width: 80px;
      }

      .sidebar-header {
        padding: 1.5rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--color-neutral-300);
      }

      .sidebar-brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .brand-text {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-text);
      }

      .collapse-btn {
        padding: 0.5rem;
      }

      .sidebar-nav {
        flex: 1;
        padding: 1rem 0;
        overflow-y: auto;
      }

      .nav-section {
        margin-bottom: 1.5rem;
      }

      .nav-section-title {
        margin: 0 0 0.75rem 1rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .nav-items {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        color: var(--color-text-muted);
        text-decoration: none;
        transition: all 0.2s ease;
        position: relative;
        border-radius: 0;
      }

      .nav-item:hover {
        background: var(--color-bg-soft);
        color: var(--color-text);
      }

      .nav-item.active {
        background: var(--color-primary-light);
        color: var(--color-primary-dark);
        font-weight: 600;
      }

      .nav-item.active::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: var(--color-primary);
      }

      .nav-item.collapsed {
        justify-content: center;
        padding: 0.75rem;
      }

      .nav-icon {
        font-size: 1.125rem;
        width: 20px;
        text-align: center;
      }

      .nav-label {
        flex: 1;
        font-size: 0.875rem;
      }

      .nav-badge {
        margin-left: auto;
      }

      .sidebar-footer {
        padding: 1rem;
        border-top: 1px solid var(--color-neutral-300);
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
        padding: 0.75rem;
        background: var(--color-bg-soft);
        border-radius: 0.5rem;
      }

      .user-avatar {
        width: 40px;
        height: 40px;
        background: var(--color-primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.125rem;
      }

      .user-details {
        flex: 1;
        min-width: 0;
      }

      .user-name {
        font-weight: 600;
        color: var(--color-text);
        font-size: 0.875rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-email {
        font-size: 0.75rem;
        color: var(--color-text-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .logout-btn {
        width: 100%;
        justify-content: flex-start;
      }

      /* Responsive Design */
      @media (max-width: 1024px) {
        .sidebar {
          transform: translateX(-100%);
        }

        .sidebar.open {
          transform: translateX(0);
        }
      }

      @media (max-width: 768px) {
        .sidebar {
          width: 100%;
          max-width: 300px;
        }

        .sidebar.collapsed {
          width: 100%;
          max-width: 80px;
        }
      }
    `,
  ],
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Input() userName = '';
  @Input() userEmail = '';
  @Input() cartItemCount = 0;
  @Output() toggleCollapseEvent = new EventEmitter<void>();
  @Output() logoutEvent = new EventEmitter<void>();

  shopItems: SidebarItem[] = [
    { label: 'All Sweets', icon: 'pi pi-th-large', route: '/customer' },
    { label: 'Categories', icon: 'pi pi-tags', route: '/customer' },
  ];

  accountItems: SidebarItem[] = [
    {
      label: 'My Purchases',
      icon: 'pi pi-shopping-bag',
      route: '/customer/purchases',
    },
    { label: 'Profile', icon: 'pi pi-user', route: '/customer/profile' },
  ];

  toggleCollapse(): void {
    this.toggleCollapseEvent.emit();
  }

  onItemClick(_item: SidebarItem): void {
    // Handle item click if needed
  }

  onLogout(): void {
    this.logoutEvent.emit();
  }
}
