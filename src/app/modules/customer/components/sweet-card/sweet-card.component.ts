import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { Sweet } from '../../services/sweet.service';

@Component({
  selector: 'app-sweet-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, BadgeModule, TagModule],
  template: `
    <p-card class="sweet-card" [class.out-of-stock]="sweet.quantity === 0">
      <ng-template pTemplate="header">
        <div class="sweet-image-container">
          <div class="sweet-image-placeholder">
            <i class="pi pi-image text-4xl text-neutral-300"></i>
          </div>
          <div class="sweet-badges">
            <p-badge
              *ngIf="sweet.quantity === 0"
              value="Out of Stock"
              severity="danger"
              class="stock-badge"
            >
            </p-badge>
            <p-badge
              *ngIf="sweet.quantity > 0 && sweet.quantity <= 5"
              value="Low Stock"
              severity="warn"
              class="stock-badge"
            >
            </p-badge>
          </div>
        </div>
      </ng-template>

      <div class="sweet-content">
        <div class="sweet-header">
          <h3 class="sweet-name">{{ sweet.name }}</h3>
          <p-tag
            *ngIf="sweet.category"
            [value]="sweet.category.name"
            severity="info"
            class="category-tag"
          >
          </p-tag>
        </div>

        <div class="sweet-price">
          <span class="price-currency">$</span>
          <span class="price-amount">{{ sweet.price | number: '1.2-2' }}</span>
        </div>

        <div class="sweet-stock" *ngIf="sweet.quantity > 0">
          <i class="pi pi-box text-sm text-neutral-500"></i>
          <span class="stock-text">{{ sweet.quantity }} in stock</span>
        </div>

        <div class="sweet-actions">
          <p-button
            *ngIf="sweet.quantity > 0"
            label="Add to Cart"
            icon="pi pi-shopping-cart"
            severity="success"
            size="small"
            [disabled]="sweet.quantity === 0"
            (onClick)="onAddToCart()"
            class="add-to-cart-btn"
          >
          </p-button>

          <p-button
            *ngIf="sweet.quantity === 0"
            label="Notify Me"
            icon="pi pi-bell"
            severity="secondary"
            size="small"
            (onClick)="onNotifyMe()"
            class="notify-btn"
          >
          </p-button>
        </div>
      </div>
    </p-card>
  `,
  styles: [
    `
      .sweet-card {
        height: 100%;
        transition: all 0.3s ease;
        border: 1px solid var(--color-neutral-300);
        border-radius: 1rem;
        overflow: hidden;
      }

      .sweet-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-large);
        border-color: var(--color-primary);
      }

      .sweet-card.out-of-stock {
        opacity: 0.7;
      }

      .sweet-image-container {
        position: relative;
        height: 200px;
        background: var(--color-bg-soft);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .sweet-image-placeholder {
        color: var(--color-neutral-300);
      }

      .sweet-badges {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .stock-badge {
        font-size: 0.75rem;
      }

      .sweet-content {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        height: 100%;
      }

      .sweet-header {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .sweet-name {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--color-text);
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .category-tag {
        align-self: flex-start;
        font-size: 0.75rem;
      }

      .sweet-price {
        display: flex;
        align-items: baseline;
        gap: 0.25rem;
        margin: 0.5rem 0;
      }

      .price-currency {
        font-size: 1rem;
        font-weight: 500;
        color: var(--color-text-muted);
      }

      .price-amount {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-primary);
      }

      .sweet-stock {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--color-text-muted);
      }

      .stock-text {
        font-weight: 500;
      }

      .sweet-actions {
        margin-top: auto;
        padding-top: 0.75rem;
      }

      .add-to-cart-btn,
      .notify-btn {
        width: 100%;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .sweet-image-container {
          height: 150px;
        }

        .sweet-content {
          padding: 0.75rem;
        }

        .sweet-name {
          font-size: 1rem;
        }

        .price-amount {
          font-size: 1.25rem;
        }
      }
    `,
  ],
})
export class SweetCardComponent {
  @Input() sweet!: Sweet;
  @Output() addToCart = new EventEmitter<Sweet>();
  @Output() notifyMe = new EventEmitter<Sweet>();

  onAddToCart(): void {
    this.addToCart.emit(this.sweet);
  }

  onNotifyMe(): void {
    this.notifyMe.emit(this.sweet);
  }
}
