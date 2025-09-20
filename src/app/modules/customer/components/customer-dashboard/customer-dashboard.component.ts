import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { AuthService as CoreAuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    BadgeModule,
    DividerModule,
    TagModule,
    ToastModule,
  ],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css'],
})
export class CustomerDashboardComponent implements OnInit {
  currentUser: any = null;
  stats = {
    totalOrders: 0,
    totalSpent: 0,
    favoriteSweets: 0,
    pendingOrders: 0,
  };

  recentOrders: any[] = [];
  recommendedSweets: any[] = [];

  constructor(
    private authService: CoreAuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initializeDashboard();
  }

  private initializeDashboard(): void {
    // TODO: Load customer data from API
    this.stats = {
      totalOrders: 12,
      totalSpent: 245.5,
      favoriteSweets: 8,
      pendingOrders: 2,
    };

    this.recentOrders = [
      {
        id: 1,
        items: 'Chocolate Truffles (3)',
        total: 25.5,
        status: 'delivered',
        date: '2024-01-15',
      },
      {
        id: 2,
        items: 'Vanilla Cupcakes (6)',
        total: 18.75,
        status: 'processing',
        date: '2024-01-14',
      },
      {
        id: 3,
        items: 'Strawberry Cheesecake',
        total: 32.0,
        status: 'pending',
        date: '2024-01-13',
      },
    ];

    this.recommendedSweets = [
      {
        id: 1,
        name: 'Chocolate Truffles',
        price: 8.5,
        image: '/assets/images/truffles.jpg',
        rating: 4.8,
      },
      {
        id: 2,
        name: 'Vanilla Cupcakes',
        price: 3.25,
        image: '/assets/images/cupcakes.jpg',
        rating: 4.6,
      },
      {
        id: 3,
        name: 'Strawberry Cheesecake',
        price: 32.0,
        image: '/assets/images/cheesecake.jpg',
        rating: 4.9,
      },
    ];
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'processing':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  onLogout(): void {
    this.authService.clearAuthData();
    this.messageService.add({
      severity: 'info',
      summary: 'Logged Out',
      detail: 'You have been successfully logged out.',
    });
  }

  onAddToCart(sweet: any): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Added to Cart',
      detail: `${sweet.name} has been added to your cart.`,
    });
  }

  trackBySweetId(index: number, sweet: any): any {
    return sweet.id;
  }

  trackByOrderId(index: number, order: any): any {
    return order.id;
  }
}
