import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
// import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';

import {
  PurchaseService,
  Purchase,
  PurchaseListQuery,
} from '../../services/purchase.service';

@Component({
  selector: 'app-purchase-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    TagModule,
    SelectModule,
    // CalendarModule,
    ToastModule,
  ],
  templateUrl: './purchase-management.component.html',
  styleUrls: ['./purchase-management.component.css'],
})
export class PurchaseManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data
  purchases: Purchase[] = [];
  selectedPurchases: Purchase[] = [];

  // UI State
  isLoading = false;

  // Filters
  filters: PurchaseListQuery = {
    page: 1,
    limit: 10,
    sortBy: 'purchasedAt',
    sortOrder: 'desc',
  };

  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalRecords = 0;
  rowsPerPage = 10;

  // Date range
  dateRange: Date[] = [];

  constructor(
    private purchaseService: PurchaseService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPurchases();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Data Loading
  loadPurchases(): void {
    this.isLoading = true;

    // Update date filters if date range is selected
    if (this.dateRange && this.dateRange.length === 2) {
      this.filters.startDate = this.dateRange[0].toISOString().split('T')[0];
      this.filters.endDate = this.dateRange[1].toISOString().split('T')[0];
    }

    this.purchaseService
      .getPurchases(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          // Ensure purchases is always an array
          this.purchases = Array.isArray(response.data) ? response.data : [];
          this.currentPage = response.pagination?.page || 1;
          this.totalPages = response.pagination?.totalPages || 1;
          this.totalRecords = response.pagination?.total || 0;
          this.isLoading = false;
        },
        error: error => {
          console.error('Error loading purchases:', error);
          // Ensure purchases is always an array even on error
          this.purchases = [];
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load purchases. Please try again.',
          });
        },
      });
  }

  // Filter Methods
  onSearchChange(): void {
    this.filters.page = 1;
    this.loadPurchases();
  }

  onDateRangeChange(): void {
    this.filters.page = 1;
    this.loadPurchases();
  }

  onSortChange(): void {
    this.filters.page = 1;
    this.loadPurchases();
  }

  clearFilters(): void {
    this.filters = {
      page: 1,
      limit: 10,
      sortBy: 'purchasedAt',
      sortOrder: 'desc',
    };
    this.dateRange = [];
    this.loadPurchases();
  }

  // Pagination
  onPageChange(event: any): void {
    this.filters.page = event.page + 1;
    this.filters.limit = event.rows;
    this.loadPurchases();
  }

  // Utility Methods
  getTotalPrice(purchase: Purchase): number {
    if (purchase.sweet?.price) {
      return parseFloat(purchase.sweet.price) * purchase.quantity;
    }
    return 0;
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  parsePrice(price: string | undefined): number {
    return Number(price || '0');
  }

  trackByPurchaseId(index: number, purchase: Purchase): number {
    return purchase.id;
  }
}
