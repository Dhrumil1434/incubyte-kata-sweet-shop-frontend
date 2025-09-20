import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';

import {
  SweetService,
  Sweet,
  Category,
  SweetListQuery,
} from '../../services/sweet.service';
import { PurchaseService } from '../../../admin/services/purchase.service';

@Component({
  selector: 'app-sweet-shop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    TagModule,
    SelectModule,
    InputNumberModule,
    PaginatorModule,
    ToastModule,
  ],
  templateUrl: './sweet-shop.component.html',
  styleUrls: ['./sweet-shop.component.css'],
})
export class SweetShopComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data
  sweets: Sweet[] = [];
  categories: Category[] = [];

  // UI State
  isLoading = false;

  // Filters
  filters: SweetListQuery = {
    page: 1,
    limit: 12,
    sortBy: 'name',
    sortOrder: 'asc',
  };

  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalRecords = 0;
  rowsPerPage = 12;

  // Search
  searchQuery = '';

  // Purchase
  purchaseQuantities: { [key: number]: number } = {};

  constructor(
    private sweetService: SweetService,
    private purchaseService: PurchaseService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadSweets();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Data Loading
  private loadSweets(): void {
    this.isLoading = true;
    this.sweetService
      .getSweets(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.sweets = response.data;
          this.currentPage = response.pagination.page;
          this.totalPages = response.pagination.totalPages;
          this.totalRecords = response.pagination.total;
          this.isLoading = false;
        },
        error: error => {
          console.error('Error loading sweets:', error);
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load sweets. Please try again.',
          });
        },
      });
  }

  private loadCategories(): void {
    this.sweetService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: categories => {
          this.categories = categories;
        },
        error: error => {
          console.error('Error loading categories:', error);
        },
      });
  }

  // Filter Methods
  onSearchChange(): void {
    this.filters.name = this.searchQuery;
    this.filters.page = 1;
    this.loadSweets();
  }

  onCategoryChange(): void {
    this.filters.page = 1;
    this.loadSweets();
  }

  onSortChange(): void {
    this.filters.page = 1;
    this.loadSweets();
  }

  onPriceRangeChange(): void {
    this.filters.page = 1;
    this.loadSweets();
  }

  onStockFilterChange(): void {
    this.filters.page = 1;
    this.loadSweets();
  }

  clearFilters(): void {
    this.filters = {
      page: 1,
      limit: 12,
      sortBy: 'name',
      sortOrder: 'asc',
    };
    this.searchQuery = '';
    this.loadSweets();
  }

  // Pagination
  onPageChange(event: any): void {
    this.filters.page = event.page + 1;
    this.filters.limit = event.rows;
    this.loadSweets();
  }

  // Purchase Methods
  onPurchase(sweet: Sweet): void {
    const quantity = this.purchaseQuantities[sweet.id] || 1;

    if (quantity > sweet.quantity) {
      this.messageService.add({
        severity: 'error',
        summary: 'Insufficient Stock',
        detail: 'Not enough items in stock for this purchase.',
      });
      return;
    }

    this.purchaseService
      .createPurchase({
        sweetId: sweet.id,
        quantity: quantity,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Purchase Successful',
            detail: `You have successfully purchased ${quantity} ${sweet.name}(s).`,
          });
          this.purchaseQuantities[sweet.id] = 1;
          this.loadSweets(); // Refresh to update stock
        },
        error: error => {
          console.error('Error purchasing sweet:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Purchase Failed',
            detail: 'Failed to complete purchase. Please try again.',
          });
        },
      });
  }

  updateQuantity(sweetId: number, quantity: number | string | null): void {
    const numQuantity =
      typeof quantity === 'string' ? Number(quantity) : quantity;
    this.purchaseQuantities[sweetId] = Math.max(1, numQuantity || 1);
  }

  // Utility Methods
  getStockStatus(quantity: number): string {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= 5) return 'Low Stock';
    return 'In Stock';
  }

  getStockSeverity(quantity: number): string {
    if (quantity === 0) return 'danger';
    if (quantity <= 5) return 'help';
    return 'success';
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  trackBySweetId(index: number, sweet: Sweet): number {
    return sweet.id;
  }
}
