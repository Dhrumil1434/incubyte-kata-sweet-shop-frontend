import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';

import { CategoryService, Category } from '../../services/category.service';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal.component';
import {
  CategoryFormModalComponent,
  CategoryFormData,
} from '../../../../shared/components/category-form-modal/category-form-modal.component';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    TagModule,
    ToastModule,
    ConfirmationModalComponent,
    CategoryFormModalComponent,
  ],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css'],
})
export class CategoryManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data
  categories: Category[] = [];

  // UI State
  isLoading = false;
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;

  // Form Data
  selectedCategory: Category | null = null;

  // Table
  selectedCategories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Data Loading
  private loadCategories(): void {
    this.isLoading = true;
    this.categoryService
      .getCategories({ limit: 100 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: _response => {
          this.categories = response.data;
          this.isLoading = false;
        },
        error: error => {
          console.error('Error loading categories:', error);
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load categories. Please try again.',
          });
        },
      });
  }

  // Modal Methods
  openAddModal(): void {
    this.selectedCategory = null;
    this.showAddModal = true;
  }

  openEditModal(category: Category): void {
    this.selectedCategory = category;
    this.showEditModal = true;
  }

  openDeleteModal(category: Category): void {
    this.selectedCategory = category;
    this.showDeleteModal = true;
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedCategory = null;
  }

  // CRUD Operations
  onSaveCategory(formData: CategoryFormData): void {
    if (this.showEditModal && this.selectedCategory) {
      this.updateCategory(formData);
    } else {
      this.addCategory(formData);
    }
  }

  private addCategory(formData: CategoryFormData): void {
    this.categoryService
      .createCategory(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: _response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Category Added',
            detail: `${formData.name} has been added successfully.`,
          });
          this.closeModals();
          this.loadCategories();
        },
        error: error => {
          console.error('Error adding category:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.getErrorMessage(error),
          });
        },
      });
  }

  private updateCategory(formData: CategoryFormData): void {
    if (!this.selectedCategory) return;

    this.categoryService
      .updateCategory(this.selectedCategory.id, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: _response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Category Updated',
            detail: `${formData.name} has been updated successfully.`,
          });
          this.closeModals();
          this.loadCategories();
        },
        error: error => {
          console.error('Error updating category:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.getErrorMessage(error),
          });
        },
      });
  }

  onConfirmDelete(): void {
    if (!this.selectedCategory) return;

    this.categoryService
      .deleteCategory(this.selectedCategory.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: _response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Category Deleted',
            detail: `${this.selectedCategory?.name} has been deleted successfully.`,
          });
          this.closeModals();
          this.loadCategories();
        },
        error: error => {
          console.error('Error deleting category:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.getErrorMessage(error),
          });
        },
      });
  }

  onReactivateCategory(category: Category): void {
    this.categoryService
      .reactivateCategory(category.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: _response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Category Reactivated',
            detail: `${category.name} has been reactivated successfully.`,
          });
          this.loadCategories();
        },
        error: error => {
          console.error('Error reactivating category:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.getErrorMessage(error),
          });
        },
      });
  }

  // Error Handling
  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    } else if (error.error?.data?.message) {
      return error.error.data.message;
    } else if (error.status === 400) {
      return 'Invalid request. Please check your input.';
    } else if (error.status === 404) {
      return 'Category not found.';
    } else if (error.status === 409) {
      return 'A category with this name already exists.';
    } else if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    return 'An unexpected error occurred. Please try again.';
  }

  // Utility Methods
  getStatusSeverity(isActive: boolean): string {
    return isActive ? 'success' : 'danger';
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  trackByCategoryId(index: number, category: Category): number {
    return category.id;
  }
}
