import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PaginatorModule } from 'primeng/paginator';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { AuthService as CoreAuthService } from '../../../../core/services/auth.service';
import {
  SweetService,
  Sweet,
  SweetSearchQuery,
  Category,
} from '../../services/sweet.service';
import { BackendTestComponent } from '../../../../shared/components/backend-test/backend-test.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    ProgressSpinnerModule,
    PaginatorModule,
    BackendTestComponent,
  ],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css'],
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<SweetSearchQuery>();

  // UI State
  isLoading = false;
  currentUser: any = null;

  // Data
  sweets: Sweet[] = [];
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  currentPage = 1;
  totalItems = 0;
  itemsPerPage = 12;

  // Search & Filter
  currentSearchQuery: SweetSearchQuery = {};
  searchQuery = '';

  constructor(
    private authService: CoreAuthService,
    private sweetService: SweetService,
    private messageService: MessageService
  ) {
    // Debounce search queries
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(query => this.performSearch(query));
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadCategories();
    this.loadSweets();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Data Loading Methods
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
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load categories. Please try again.',
          });
        },
      });
  }

  private loadSweets(): void {
    this.isLoading = true;
    const query = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      ...this.currentSearchQuery,
    };

    this.sweetService
      .getSweets(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          console.log('Frontend received response:', response);
          console.log('Sweets data:', response.data);
          console.log('Pagination:', response.pagination);
          this.sweets = response.data;
          this.totalItems = response.pagination.total;
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

  // Category Methods
  filterByCategory(category: Category): void {
    this.selectedCategory = category;
    this.currentSearchQuery = {
      ...this.currentSearchQuery,
      category: category.name,
    };
    this.currentPage = 1;
    this.loadSweets();
  }

  clearCategoryFilter(): void {
    this.selectedCategory = null;
    this.currentSearchQuery = {
      ...this.currentSearchQuery,
      category: undefined,
    };
    this.currentPage = 1;
    this.loadSweets();
  }

  // Search Methods
  onSearchInputChange(): void {
    this.currentSearchQuery = {
      ...this.currentSearchQuery,
      q: this.searchQuery || undefined,
    };
    this.currentPage = 1;
    this.searchSubject.next(this.currentSearchQuery);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentSearchQuery = {
      ...this.currentSearchQuery,
      q: undefined,
    };
    this.currentPage = 1;
    this.loadSweets();
  }

  clearAllFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = null;
    this.currentSearchQuery = {};
    this.currentPage = 1;
    this.loadSweets();
  }

  private performSearch(_query: SweetSearchQuery): void {
    this.loadSweets();
  }

  // Pagination Methods
  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.loadSweets();
  }

  // Purchase Methods
  onPurchase(sweet: Sweet): void {
    if (sweet.quantity <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Out of Stock',
        detail: 'This sweet is currently out of stock.',
      });
      return;
    }

    // Call the purchase API
    this.sweetService
      .purchaseSweet(sweet.id, 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: _response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Purchase Successful',
            detail: `You have successfully purchased ${sweet.name} for $${sweet.price}.`,
          });
          // Refresh the sweets list to update quantities
          this.loadSweets();
        },
        error: error => {
          console.error('Purchase error:', error);
          let errorMessage = 'Failed to purchase sweet. Please try again.';

          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.data?.message) {
            errorMessage = error.error.data.message;
          } else if (error.status === 400) {
            errorMessage =
              'Invalid purchase request. Please check the quantity.';
          } else if (error.status === 404) {
            errorMessage = 'Sweet not found. It may have been removed.';
          } else if (error.status === 409) {
            errorMessage = 'Insufficient quantity available for purchase.';
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Purchase Failed',
            detail: errorMessage,
          });
        },
      });
  }

  // Logout Method
  onLogout(): void {
    this.authService.clearAuthData();
    this.messageService.add({
      severity: 'info',
      summary: 'Logged Out',
      detail: 'You have been successfully logged out.',
    });
  }

  // Utility Methods
  trackBySweetId(index: number, sweet: Sweet): number {
    return sweet.id;
  }

  trackByCategoryId(index: number, category: Category): number {
    return category.id;
  }
}
