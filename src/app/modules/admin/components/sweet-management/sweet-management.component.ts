import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';

import {
  SweetService,
  Sweet,
  Category,
} from '../../../customer/services/sweet.service';
import { CategoryService } from '../../services/category.service';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal.component';
import {
  SweetFormModalComponent,
  SweetFormData,
} from '../../../../shared/components/sweet-form-modal/sweet-form-modal.component';

@Component({
  selector: 'app-sweet-management',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    TagModule,
    ToastModule,
    ConfirmationModalComponent,
    SweetFormModalComponent,
  ],
  templateUrl: './sweet-management.component.html',
  styleUrls: ['./sweet-management.component.css'],
})
export class SweetManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data
  sweets: Sweet[] = [];
  categories: Category[] = [];

  // UI State
  isLoading = false;
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;

  // Form Data
  selectedSweet: Sweet | null = null;

  // Table
  selectedSweets: Sweet[] = [];

  constructor(
    private sweetService: SweetService,
    private categoryService: CategoryService,
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
      .getSweets({ limit: 100 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.sweets = response.data;
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
    this.categoryService
      .getActiveCategories()
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

  // Modal Methods
  openAddModal(): void {
    this.selectedSweet = null;
    this.showAddModal = true;
  }

  openEditModal(sweet: Sweet): void {
    this.selectedSweet = sweet;
    this.showEditModal = true;
  }

  openDeleteModal(sweet: Sweet): void {
    this.selectedSweet = sweet;
    this.showDeleteModal = true;
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedSweet = null;
  }

  // CRUD Operations
  onSaveSweet(formData: SweetFormData): void {
    if (this.showEditModal && this.selectedSweet) {
      this.updateSweet(formData);
    } else {
      this.addSweet(formData);
    }
  }

  private addSweet(formData: SweetFormData): void {
    // TODO: Implement add sweet API call
    this.messageService.add({
      severity: 'success',
      summary: 'Sweet Added',
      detail: `${formData.name} has been added successfully.`,
    });
    this.closeModals();
    this.loadSweets();
  }

  private updateSweet(formData: SweetFormData): void {
    if (!this.selectedSweet) return;

    // TODO: Implement update sweet API call
    this.messageService.add({
      severity: 'success',
      summary: 'Sweet Updated',
      detail: `${formData.name} has been updated successfully.`,
    });
    this.closeModals();
    this.loadSweets();
  }

  onConfirmDelete(): void {
    if (!this.selectedSweet) return;

    // TODO: Implement delete sweet API call
    this.messageService.add({
      severity: 'success',
      summary: 'Sweet Deleted',
      detail: `${this.selectedSweet.name} has been deleted successfully.`,
    });
    this.closeModals();
    this.loadSweets();
  }

  // Utility Methods
  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  }

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

  trackBySweetId(index: number, sweet: Sweet): number {
    return sweet.id;
  }
}
