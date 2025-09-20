import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';

export interface SweetFormData {
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  isActive: boolean;
}

@Component({
  selector: 'app-sweet-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
  ],
  template: `
    <p-dialog
      [visible]="visible"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '600px' }"
      (onHide)="onCancel()"
    >
      <ng-template pTemplate="header">
        <div class="dialog-header">
          <i class="pi pi-box header-icon"></i>
          <h3 class="header-title">
            {{ isEdit ? 'Edit Sweet' : 'Add New Sweet' }}
          </h3>
        </div>
      </ng-template>

      <div class="dialog-content">
        <form (ngSubmit)="onSubmit()" #sweetForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label for="sweetName" class="form-label">
                Sweet Name <span class="required">*</span>
              </label>
              <input
                id="sweetName"
                type="text"
                pInputText
                [(ngModel)]="formData.name"
                name="sweetName"
                placeholder="Enter sweet name"
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
                  >Sweet name is required.</span
                >
                <span *ngIf="nameInput.errors?.['minlength']"
                  >Sweet name must be at least 2 characters long.</span
                >
                <span *ngIf="nameInput.errors?.['maxlength']"
                  >Sweet name must be less than 255 characters.</span
                >
              </div>
            </div>

            <div class="form-group">
              <label for="sweetCategory" class="form-label">
                Category <span class="required">*</span>
              </label>
              <p-select
                id="sweetCategory"
                [(ngModel)]="formData.categoryId"
                name="sweetCategory"
                [options]="categoryOptions"
                optionLabel="name"
                optionValue="id"
                placeholder="Select category"
                class="form-select"
                required
                #categoryInput="ngModel"
              >
              </p-select>

              <div
                *ngIf="
                  categoryInput.invalid &&
                  (categoryInput.dirty || categoryInput.touched)
                "
                class="error-message"
              >
                <i class="pi pi-exclamation-circle error-icon"></i>
                <span>Please select a category.</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="sweetPrice" class="form-label">
                Price <span class="required">*</span>
              </label>
              <p-inputNumber
                id="sweetPrice"
                [(ngModel)]="formData.price"
                name="sweetPrice"
                mode="currency"
                currency="USD"
                locale="en-US"
                placeholder="0.00"
                class="form-input"
                [min]="0"
                [max]="9999.99"
                [step]="0.01"
                required
                #priceInput="ngModel"
              >
              </p-inputNumber>

              <div
                *ngIf="
                  priceInput.invalid && (priceInput.dirty || priceInput.touched)
                "
                class="error-message"
              >
                <i class="pi pi-exclamation-circle error-icon"></i>
                <span *ngIf="priceInput.errors?.['required']"
                  >Price is required.</span
                >
                <span *ngIf="priceInput.errors?.['min']"
                  >Price must be greater than or equal to 0.</span
                >
                <span *ngIf="priceInput.errors?.['max']"
                  >Price must be less than 10000.</span
                >
              </div>
            </div>

            <div class="form-group">
              <label for="sweetQuantity" class="form-label">
                Quantity <span class="required">*</span>
              </label>
              <p-inputNumber
                id="sweetQuantity"
                [(ngModel)]="formData.quantity"
                name="sweetQuantity"
                placeholder="0"
                class="form-input"
                [min]="0"
                [max]="9999"
                required
                #quantityInput="ngModel"
              >
              </p-inputNumber>

              <div
                *ngIf="
                  quantityInput.invalid &&
                  (quantityInput.dirty || quantityInput.touched)
                "
                class="error-message"
              >
                <i class="pi pi-exclamation-circle error-icon"></i>
                <span *ngIf="quantityInput.errors?.['required']"
                  >Quantity is required.</span
                >
                <span *ngIf="quantityInput.errors?.['min']"
                  >Quantity must be greater than or equal to 0.</span
                >
                <span *ngIf="quantityInput.errors?.['max']"
                  >Quantity must be less than 10000.</span
                >
              </div>
            </div>
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
            [label]="isEdit ? 'Update Sweet' : 'Add Sweet'"
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
  styleUrls: ['./sweet-form-modal.component.css'],
})
export class SweetFormModalComponent implements OnInit {
  @Input() visible = false;
  @Input() isEdit = false;
  @Input() loading = false;
  @Input() sweetData: SweetFormData | null = null;
  @Input() categories: Category[] = [];

  @Output() save = new EventEmitter<SweetFormData>();
  @Output() cancel = new EventEmitter<void>();

  formData: SweetFormData = {
    name: '',
    price: 0,
    quantity: 0,
    categoryId: 0,
  };

  categoryOptions: { id: number; name: string }[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.categoryOptions = this.categories
      .filter(cat => cat.isActive)
      .map(cat => ({ id: cat.id, name: cat.name }));

    if (this.isEdit && this.sweetData) {
      this.formData = { ...this.sweetData };
    } else {
      this.formData = {
        name: '',
        price: 0,
        quantity: 0,
        categoryId: 0,
      };
    }
  }

  isFormValid(): boolean {
    return (
      this.formData.name.trim().length >= 2 &&
      this.formData.name.trim().length <= 255 &&
      this.formData.price >= 0 &&
      this.formData.quantity >= 0 &&
      this.formData.categoryId > 0
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

    this.save.emit({ ...this.formData });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
