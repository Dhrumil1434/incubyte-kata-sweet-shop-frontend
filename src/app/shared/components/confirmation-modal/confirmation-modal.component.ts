import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog
      [visible]="visible"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '400px' }"
      (onHide)="onCancel()"
    >
      <ng-template pTemplate="header">
        <div class="dialog-header">
          <i [class]="iconClass" class="header-icon"></i>
          <h3 class="header-title">{{ title }}</h3>
        </div>
      </ng-template>

      <div class="dialog-content">
        <div class="confirmation-message">
          <p>{{ message }}</p>
          <p *ngIf="details" class="confirmation-details">{{ details }}</p>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <p-button
            [label]="cancelLabel"
            severity="secondary"
            [text]="true"
            (onClick)="onCancel()"
            class="cancel-btn"
          >
          </p-button>
          <p-button
            [label]="confirmLabel"
            [severity]="confirmSeverity"
            (onClick)="onConfirm()"
            [loading]="loading"
            class="confirm-btn"
          >
          </p-button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styleUrls: ['./confirmation-modal.component.css'],
})
export class ConfirmationModalComponent {
  @Input() visible = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() details = '';
  @Input() confirmLabel = 'Confirm';
  @Input() cancelLabel = 'Cancel';
  @Input() confirmSeverity:
    | 'success'
    | 'info'
    | 'danger'
    | 'secondary'
    | 'help'
    | 'contrast' = 'danger';
  @Input() loading = false;
  @Input() iconClass = 'pi pi-exclamation-triangle';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
