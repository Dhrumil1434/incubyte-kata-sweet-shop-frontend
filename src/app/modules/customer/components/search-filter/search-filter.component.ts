import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { SweetSearchQuery, Category } from '../../services/sweet.service';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    SelectModule,
    SliderModule,
    ButtonModule,
    CheckboxModule,
    CardModule,
  ],
  template: `
    <p-card class="search-filter-card">
      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-input-container">
          <i class="pi pi-search search-icon"></i>
          <input
            type="text"
            pInputText
            placeholder="Search for sweets..."
            [(ngModel)]="searchQuery"
            (input)="onSearchChange()"
            class="search-input"
          />
          <p-button
            *ngIf="searchQuery"
            icon="pi pi-times"
            severity="secondary"
            [text]="true"
            size="small"
            (onClick)="clearSearch()"
            class="clear-search-btn"
          >
          </p-button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <h4 class="filters-title">Filters</h4>

        <!-- Category Filter -->
        <div class="filter-group">
          <label class="filter-label">Category</label>
          <p-select
            [(ngModel)]="selectedCategory"
            [options]="categoryOptions"
            placeholder="All Categories"
            (onChange)="onFilterChange()"
            class="filter-select"
          >
          </p-select>
        </div>

        <!-- Price Range Filter -->
        <div class="filter-group">
          <label class="filter-label">Price Range</label>
          <div class="price-range">
            <input
              type="number"
              pInputText
              placeholder="Min"
              [(ngModel)]="minPrice"
              (input)="onFilterChange()"
              class="price-input"
            />
            <span class="price-separator">-</span>
            <input
              type="number"
              pInputText
              placeholder="Max"
              [(ngModel)]="maxPrice"
              (input)="onFilterChange()"
              class="price-input"
            />
          </div>
        </div>

        <!-- Stock Filter -->
        <div class="filter-group">
          <div class="checkbox-container">
            <p-checkbox
              [(ngModel)]="inStockOnly"
              (onChange)="onFilterChange()"
              [binary]="true"
              inputId="inStock"
            >
            </p-checkbox>
            <label for="inStock" class="checkbox-label">In Stock Only</label>
          </div>
        </div>

        <!-- Sort Options -->
        <div class="filter-group">
          <label class="filter-label">Sort By</label>
          <p-select
            [(ngModel)]="sortBy"
            [options]="sortOptions"
            (onChange)="onFilterChange()"
            class="filter-select"
          >
          </p-select>
        </div>

        <!-- Filter Actions -->
        <div class="filter-actions">
          <p-button
            label="Clear Filters"
            severity="secondary"
            [text]="true"
            size="small"
            (onClick)="clearFilters()"
            class="clear-filters-btn"
          >
          </p-button>
          <p-button
            label="Apply Filters"
            severity="success"
            size="small"
            (onClick)="applyFilters()"
            class="apply-filters-btn"
          >
          </p-button>
        </div>
      </div>
    </p-card>
  `,
  styles: [
    `
      .search-filter-card {
        margin-bottom: 1.5rem;
      }

      .search-section {
        margin-bottom: 1.5rem;
      }

      .search-input-container {
        position: relative;
        display: flex;
        align-items: center;
      }

      .search-icon {
        position: absolute;
        left: 1rem;
        color: var(--color-text-muted);
        z-index: 1;
      }

      .search-input {
        width: 100%;
        padding-left: 2.5rem;
        padding-right: 3rem;
        border-radius: 0.75rem;
        border: 2px solid var(--color-neutral-300);
        font-size: 1rem;
        transition: all 0.2s ease;
      }

      .search-input:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(0, 107, 60, 0.1);
      }

      .clear-search-btn {
        position: absolute;
        right: 0.5rem;
        z-index: 1;
      }

      .filters-section {
        border-top: 1px solid var(--color-neutral-300);
        padding-top: 1.5rem;
      }

      .filters-title {
        margin: 0 0 1rem 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--color-text);
      }

      .filter-group {
        margin-bottom: 1.25rem;
      }

      .filter-label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text);
      }

      .filter-select {
        width: 100%;
      }

      .price-range {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .price-input {
        flex: 1;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--color-neutral-300);
        border-radius: 0.5rem;
        font-size: 0.875rem;
      }

      .price-input:focus {
        border-color: var(--color-primary);
        outline: none;
      }

      .price-separator {
        color: var(--color-text-muted);
        font-weight: 500;
      }

      .checkbox-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .checkbox-label {
        font-size: 0.875rem;
        color: var(--color-text);
        cursor: pointer;
      }

      .filter-actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid var(--color-neutral-300);
      }

      .clear-filters-btn,
      .apply-filters-btn {
        flex: 1;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .price-range {
          flex-direction: column;
          gap: 0.5rem;
        }

        .price-separator {
          display: none;
        }

        .filter-actions {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class SearchFilterComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Output() searchChange = new EventEmitter<SweetSearchQuery>();
  @Output() filterChange = new EventEmitter<SweetSearchQuery>();

  searchQuery = '';
  selectedCategory: string | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  inStockOnly = false;
  sortBy = 'name';

  categoryOptions: { label: string; value: string }[] = [];
  sortOptions = [
    { label: 'Name (A-Z)', value: 'name' },
    { label: 'Name (Z-A)', value: 'name_desc' },
    { label: 'Price (Low to High)', value: 'price' },
    { label: 'Price (High to Low)', value: 'price_desc' },
    { label: 'Newest First', value: 'createdAt_desc' },
    { label: 'Oldest First', value: 'createdAt' },
  ];

  ngOnInit(): void {
    this.updateCategoryOptions();
  }

  ngOnChanges(): void {
    this.updateCategoryOptions();
  }

  private updateCategoryOptions(): void {
    this.categoryOptions = [
      { label: 'All Categories', value: '' },
      ...this.categories.map(cat => ({
        label: cat.name,
        value: cat.name,
      })),
    ];
  }

  onSearchChange(): void {
    this.emitSearchQuery();
  }

  onFilterChange(): void {
    this.emitSearchQuery();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.emitSearchQuery();
  }

  clearFilters(): void {
    this.selectedCategory = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.inStockOnly = false;
    this.sortBy = 'name';
    this.emitSearchQuery();
  }

  applyFilters(): void {
    this.emitSearchQuery();
  }

  private emitSearchQuery(): void {
    const query: SweetSearchQuery = {
      q: this.searchQuery || undefined,
      category: this.selectedCategory || undefined,
      minPrice: this.minPrice || undefined,
      maxPrice: this.maxPrice || undefined,
      inStock: this.inStockOnly || undefined,
    };

    this.searchChange.emit(query);
    this.filterChange.emit(query);
  }
}
