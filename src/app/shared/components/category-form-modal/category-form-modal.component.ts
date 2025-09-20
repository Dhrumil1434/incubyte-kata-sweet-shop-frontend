import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

export interface CategoryFormData {
  name: string;
}

@Component({
  selector: 'app-category-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
  ],
  template: `
    <p-dialog
      [visible]="visible"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '500px' }"
      (onHide)="onCancel()"
    >
      <ng-template pTemplate="header">
        <div class="dialog-header">
          <i class="pi pi-tags header-icon"></i>
          <h3 class="header-title">
            {{ isEdit ? 'Edit Category' : 'Add New Category' }}
          </h3>
        </div>
      </ng-template>

      <div class="dialog-content">
        <form (ngSubmit)="onSubmit()" #categoryForm="ngForm">
          <div class="form-group">
            <label for="categoryName" class="form-label">
              Category Name <span class="required">*</span>
            </label>
            <input
              id="categoryName"
              type="text"
              pInputText
              [(ngModel)]="formData.name"
              name="categoryName"
              placeholder="Enter category name"
              class="form-input"
              maxlength="255"
              required
              #nameInput="ngModel"
            />

            <div
              *ngIf="
                nameInput.invalid && (nameInput.dirty || nameInput.touched)
              "
              class="error-message"
            >
              <i class="pi pi-exclamation-circle error-icon"></i>
              <span *ngIf="nameInput.errors?.['required']"
                >Category name is required.</span
              >
              <span *ngIf="nameInput.errors?.['minlength']"
                >Category name must be at least 2 characters long.</span
              >
              <span *ngIf="nameInput.errors?.['maxlength']"
                >Category name must be less than 255 characters.</span
              >
            </div>

            <small class="form-hint">
              Category name must start with a letter and contain only letters,
              numbers, spaces, dots, hyphens, and ampersands.
            </small>
          </div>
        </form>
      </div>

      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <p-button
            label="Cancel"
            severity="secondary"
            [text]="true"
            (onClick)="onCancel()"
            [disabled]="loading"
            class="cancel-btn"
          >
          </p-button>
          <p-button
            [label]="isEdit ? 'Update Category' : 'Add Category'"
            severity="success"
            (onClick)="onSubmit()"
            [loading]="loading"
            [disabled]="!isFormValid()"
            class="confirm-btn"
          >
          </p-button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styleUrls: ['./category-form-modal.component.css'],
})
export class CategoryFormModalComponent implements OnInit {
  @Input() visible = false;
  @Input() isEdit = false;
  @Input() loading = false;
  @Input() categoryData: CategoryFormData | null = null;

  @Output() save = new EventEmitter<CategoryFormData>();
  @Output() cancel = new EventEmitter<void>();

  formData: CategoryFormData = {
    name: '',
  };

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    if (this.isEdit && this.categoryData) {
      this.formData = { ...this.categoryData };
    } else {
      this.formData = { name: '' };
    }
  }

  isFormValid(): boolean {
    return (
      this.formData.name.trim().length >= 2 &&
      this.formData.name.trim().length <= 255
    );
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly.',
        life: 3000,
      });
      return;
    }

    // Validate name pattern
    if (!/^[A-Za-z][A-Za-z0-9\s.&-]*$/.test(this.formData.name.trim())) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail:
          'Category name must start with a letter and contain only letters, numbers, spaces, dots, hyphens, and ampersands.',
        life: 3000,
      });
      return;
    }

    this.save.emit({ ...this.formData });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
