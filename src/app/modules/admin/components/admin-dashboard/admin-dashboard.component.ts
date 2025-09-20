import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { AuthService as CoreAuthService } from '../../../../core/services/auth.service';
import { ROLE_LABELS } from '../../../../core/constants/role.constants';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    ChartModule,
    TableModule,
    TagModule,
    BadgeModule,
    DividerModule,
    ToastModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  currentUser: any = null;
  stats = {
    totalUsers: 0,
    totalSweets: 0,
    totalOrders: 0,
    totalRevenue: 0,
  };

  recentUsers: any[] = [];
  recentOrders: any[] = [];
  chartData: any;
  chartOptions: any;

  constructor(
    private authService: CoreAuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initializeDashboard();
    this.setupCharts();
  }

  private initializeDashboard(): void {
    // TODO: Load dashboard data from API
    this.stats = {
      totalUsers: 156,
      totalSweets: 24,
      totalOrders: 89,
      totalRevenue: 12500,
    };

    this.recentUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
        status: 'active',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'customer',
        status: 'active',
      },
      {
        id: 3,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        status: 'active',
      },
    ];

    this.recentOrders = [
      {
        id: 1,
        customer: 'John Doe',
        total: 25.5,
        status: 'completed',
        date: '2024-01-15',
      },
      {
        id: 2,
        customer: 'Jane Smith',
        total: 18.75,
        status: 'pending',
        date: '2024-01-15',
      },
      {
        id: 3,
        customer: 'Bob Wilson',
        total: 32.0,
        status: 'processing',
        date: '2024-01-14',
      },
    ];
  }

  private setupCharts(): void {
    this.chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue',
          data: [1200, 1900, 3000, 5000, 2000, 3000],
          borderColor: '#006B3C',
          backgroundColor: 'rgba(0, 107, 60, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Orders',
          data: [12, 19, 30, 50, 20, 30],
          borderColor: '#FF6B35',
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          tension: 0.4,
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  }

  getRoleLabel(role: string): string {
    return ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role;
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'active':
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
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
}
