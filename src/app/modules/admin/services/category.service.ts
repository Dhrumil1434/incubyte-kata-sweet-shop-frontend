import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from '../../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

export interface Category {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreate {
  name: string;
}

export interface CategoryUpdate {
  name?: string;
}

export interface CategoryListQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  name?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private baseApiService: BaseApiService) {}

  /**
   * Get list of categories with pagination and filters
   */
  getCategories(
    query: CategoryListQuery = {}
  ): Observable<PaginatedResponse<Category>> {
    const params = new URLSearchParams();

    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);
    if (query.name) params.append('name', query.name);

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.CATEGORIES}?${queryString}`
      : API_ENDPOINTS.CATEGORIES;

    return this.baseApiService.get<any>(url).pipe(
      map(response => {
        // Handle paginated response from backend
        if (response.data && response.data.data) {
          return {
            data: response.data.data,
            pagination: response.data.pagination,
          };
        }
        // Fallback for non-paginated response
        return {
          data: response.data || [],
          pagination: {
            totalRecords: response.data?.length || 0,
            currentPage: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      })
    );
  }

  /**
   * Get active categories (for dropdowns)
   */
  getActiveCategories(): Observable<Category[]> {
    return this.baseApiService
      .get<any>(`${API_ENDPOINTS.CATEGORIES}/active/list`)
      .pipe(map(response => response.data || []));
  }

  /**
   * Get category by ID
   */
  getCategoryById(id: number): Observable<Category> {
    return this.baseApiService
      .get<any>(`${API_ENDPOINTS.CATEGORIES}/${id}`)
      .pipe(map(response => response.data || null));
  }

  /**
   * Create a new category
   */
  createCategory(category: CategoryCreate): Observable<Category> {
    return this.baseApiService
      .post<any>(API_ENDPOINTS.CATEGORIES, category)
      .pipe(map(response => response.data || null));
  }

  /**
   * Update a category
   */
  updateCategory(id: number, category: CategoryUpdate): Observable<Category> {
    return this.baseApiService
      .put<any>(`${API_ENDPOINTS.CATEGORIES}/${id}`, category)
      .pipe(map(response => response.data || null));
  }

  /**
   * Delete a category
   */
  deleteCategory(id: number): Observable<any> {
    return this.baseApiService.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`);
  }

  /**
   * Reactivate a category
   */
  reactivateCategory(id: number): Observable<Category> {
    return this.baseApiService
      .post<any>(`${API_ENDPOINTS.CATEGORIES}/${id}/reactivate`, {})
      .pipe(map(response => response.data || null));
  }
}
