import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../core/services/loader.service';
import { Subject, takeUntil } from 'rxjs';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger' | 'success' | 'warning' | 'info';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-common-loader-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || isLoading"
      [class]="getButtonClasses()"
      (click)="onClick()"
      [attr.aria-label]="ariaLabel"
      [title]="title"
    >
      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="loading-spinner" [attr.aria-hidden]="true">
        <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Button Content -->
      <div class="button-content" [class.loading]="isLoading">
        <ng-content></ng-content>
      </div>

      <!-- Loading Text -->
      <span *ngIf="isLoading && loadingText" class="loading-text">
        {{ loadingText }}
      </span>
    </button>
  `,
  styles: [`
    button {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border: 1px solid transparent;
      border-radius: 0.5rem;
      font-weight: 500;
      transition: all 150ms ease;
      cursor: pointer;
      outline: none;
      text-decoration: none;
      white-space: nowrap;
      overflow: hidden;
    }

    button:focus {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }

    /* Size Variants */
    .btn-sm {
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      min-height: 2rem;
    }

    .btn-md {
      padding: 0.625rem 1rem;
      font-size: 0.875rem;
      min-height: 2.5rem;
    }

    .btn-lg {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      min-height: 3rem;
    }

    /* Variant Styles */
    .btn-primary {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--color-primary-light);
      border-color: var(--color-primary-light);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 107, 60, 0.15);
    }

    .btn-primary:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 107, 60, 0.1);
    }

    .btn-secondary {
      background-color: var(--color-bg-soft);
      border-color: var(--color-neutral-300);
      color: var(--color-text);
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: var(--color-neutral-300);
      border-color: var(--color-neutral-300);
    }

    .btn-outline {
      background-color: transparent;
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    .btn-outline:hover:not(:disabled) {
      background-color: var(--color-primary);
      color: white;
    }

    .btn-text {
      background-color: transparent;
      border-color: transparent;
      color: var(--color-primary);
      padding: 0.5rem;
    }

    .btn-text:hover:not(:disabled) {
      background-color: var(--color-bg-soft);
    }

    .btn-danger {
      background-color: var(--color-error);
      border-color: var(--color-error);
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #c0392b;
      border-color: #c0392b;
    }

    .btn-success {
      background-color: var(--color-success);
      border-color: var(--color-success);
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background-color: #27ae60;
      border-color: #27ae60;
    }

    .btn-warning {
      background-color: var(--color-warning);
      border-color: var(--color-warning);
      color: white;
    }

    .btn-warning:hover:not(:disabled) {
      background-color: #e67e22;
      border-color: #e67e22;
    }

    .btn-info {
      background-color: var(--color-info);
      border-color: var(--color-info);
      color: white;
    }

    .btn-info:hover:not(:disabled) {
      background-color: #2980b9;
      border-color: #2980b9;
    }

    /* Full Width */
    .btn-full {
      width: 100%;
    }

    /* Loading States */
    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .button-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: opacity 150ms ease;
    }

    .button-content.loading {
      opacity: 0.7;
    }

    .loading-text {
      margin-left: 0.5rem;
      font-size: 0.875rem;
    }

    /* Animation for loading state */
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `]
})
export class CommonLoaderButtonComponent implements OnInit, OnDestroy {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Input() buttonId = '';
  @Input() loadingText = '';
  @Input() ariaLabel = '';
  @Input() title = '';

  @Output() clicked = new EventEmitter<void>();

  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    if (this.buttonId) {
      // Subscribe to button loader state
      this.loaderService.getButtonLoaders$()
        .pipe(takeUntil(this.destroy$))
        .subscribe(buttonLoaders => {
          this.isLoading = buttonLoaders.get(this.buttonId) || false;
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClick() {
    if (!this.disabled && !this.isLoading) {
      this.clicked.emit();
    }
  }

  getButtonClasses(): string {
    const classes = [
      `btn-${this.variant}`,
      `btn-${this.size}`,
    ];

    if (this.fullWidth) {
      classes.push('btn-full');
    }

    return classes.join(' ');
  }
}
