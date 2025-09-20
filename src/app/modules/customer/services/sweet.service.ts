import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from '../../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

export interface Sweet {
  id: number;
  name: string;
  categoryId: number;
  price: number;
  quantity: number;
  isActive: boolean;
  category?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SweetListQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface SweetSearchQuery {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface Category {
  id: number;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SweetService {
  constructor(private baseApiService: BaseApiService) {}

  /**
   * Get list of sweets with pagination and filters
   */
  getSweets(query: SweetListQuery = {}): Observable<PaginatedResponse<Sweet>> {
    const params = new URLSearchParams();

    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);
    if (query.name) params.append('name', query.name);
    if (query.category) params.append('category', query.category);
    if (query.minPrice) params.append('minPrice', query.minPrice.toString());
    if (query.maxPrice) params.append('maxPrice', query.maxPrice.toString());
    if (query.inStock !== undefined)
      params.append('inStock', query.inStock.toString());

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.SWEETS}?${queryString}`
      : API_ENDPOINTS.SWEETS;

    return this.baseApiService.get<any>(url).pipe(
      map(response => {
        console.log('Raw API response from backend:', response);
        console.log('Response structure:', {
          hasData: !!response.data,
          dataType: typeof response.data,
          dataKeys: response.data ? Object.keys(response.data) : 'no data',
          hasItems: response.data && response.data.items ? 'yes' : 'no',
          hasNestedData: response.data && response.data.data ? 'yes' : 'no',
        });

        // Handle paginated response from backend (items structure)
        if (response.data && response.data.items) {
          console.log('Using items response structure');
          return {
            data: response.data.items,
            pagination: {
              page: response.data.pagination?.currentPage || 1,
              limit: response.data.pagination?.limit || 10,
              total: response.data.total || 0,
              totalPages: response.data.pagination?.totalPages || 1,
              hasNext: response.data.pagination?.hasNextPage || false,
              hasPrev: response.data.pagination?.hasPreviousPage || false,
            },
          };
        }

        // Handle nested data structure (fallback)
        if (response.data && response.data.data) {
          console.log('Using nested data response structure');
          return {
            data: response.data.data,
            pagination: {
              page: response.data.pagination?.currentPage || 1,
              limit: response.data.pagination?.limit || 10,
              total: response.data.pagination?.totalRecords || 0,
              totalPages: response.data.pagination?.totalPages || 1,
              hasNext: response.data.pagination?.hasNextPage || false,
              hasPrev: response.data.pagination?.hasPreviousPage || false,
            },
          };
        }

        // Fallback for non-paginated response
        console.log('Using fallback response structure');
        return {
          data: response.data || [],
          pagination: {
            page: 1,
            limit: 10,
            total: response.data?.length || 0,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        };
      })
    );
  }

  /**
   * Search sweets
   */
  searchSweets(
    query: SweetSearchQuery = {}
  ): Observable<PaginatedResponse<Sweet>> {
    const params = new URLSearchParams();

    if (query.q) params.append('q', query.q);
    if (query.category) params.append('category', query.category);
    if (query.minPrice) params.append('minPrice', query.minPrice.toString());
    if (query.maxPrice) params.append('maxPrice', query.maxPrice.toString());
    if (query.inStock !== undefined)
      params.append('inStock', query.inStock.toString());

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.SWEETS}/search?${queryString}`
      : `${API_ENDPOINTS.SWEETS}/search`;

    return this.baseApiService
      .get<any>(url)
      .pipe(map(response => response.data));
  }

  /**
   * Get categories
   */
  getCategories(): Observable<Category[]> {
    return this.baseApiService
      .get<any>(`${API_ENDPOINTS.CATEGORIES}/active/list`)
      .pipe(
        map(response => {
          console.log('Categories response:', response);
          return response.data;
        })
      );
  }

  /**
   * Purchase a sweet
   */
  purchaseSweet(sweetId: number, quantity: number): Observable<any> {
    return this.baseApiService.post(
      `${API_ENDPOINTS.SWEETS}/${sweetId}/purchase`,
      { quantity }
    );
  }

  /**
   * Get sweet by ID
   */
  getSweetById(sweetId: number): Observable<Sweet> {
    return this.baseApiService
      .get<any>(`${API_ENDPOINTS.SWEETS}/${sweetId}`)
      .pipe(map(response => response.data));
  }
}
