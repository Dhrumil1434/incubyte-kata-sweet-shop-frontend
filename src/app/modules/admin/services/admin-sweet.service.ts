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

export interface SweetCreate {
  name: string;
  categoryId: number;
  price: number;
  quantity: number;
}

export interface SweetUpdate {
  name?: string;
  categoryId?: number;
  price?: number;
  quantity?: number;
}

export interface SweetListQuery {
  page?: number;
  limit?: number;
  sortBy?: 'id' | 'name' | 'price' | 'quantity' | 'createdAt' | 'updatedAt';
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

export interface SweetPurchase {
  quantity: number;
}

export interface SweetRestock {
  quantity: number;
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

@Injectable({
  providedIn: 'root',
})
export class AdminSweetService {
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
        // Handle paginated response from backend
        if (response.data && response.data.data) {
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
      ? `${API_ENDPOINTS.SWEETS_SEARCH}?${queryString}`
      : API_ENDPOINTS.SWEETS_SEARCH;

    return this.baseApiService.get<any>(url).pipe(
      map(response => {
        if (response.data && response.data.data) {
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
   * Get sweet by ID
   */
  getSweetById(id: number): Observable<Sweet> {
    return this.baseApiService
      .get<any>(`${API_ENDPOINTS.SWEETS}/${id}`)
      .pipe(map(response => response.data));
  }

  /**
   * Create new sweet
   */
  createSweet(sweetData: SweetCreate): Observable<Sweet> {
    return this.baseApiService
      .post<any>(API_ENDPOINTS.SWEETS, sweetData)
      .pipe(map(response => response.data));
  }

  /**
   * Update sweet
   */
  updateSweet(id: number, sweetData: SweetUpdate): Observable<Sweet> {
    return this.baseApiService
      .put<any>(`${API_ENDPOINTS.SWEETS}/${id}`, sweetData)
      .pipe(map(response => response.data));
  }

  /**
   * Delete sweet (soft delete)
   */
  deleteSweet(id: number): Observable<any> {
    return this.baseApiService.delete(`${API_ENDPOINTS.SWEETS}/${id}`);
  }

  /**
   * Reactivate sweet
   */
  reactivateSweet(id: number): Observable<Sweet> {
    return this.baseApiService
      .post<any>(API_ENDPOINTS.SWEET_REACTIVATE(id), {})
      .pipe(map(response => response.data));
  }

  /**
   * Purchase sweet
   */
  purchaseSweet(id: number, purchaseData: SweetPurchase): Observable<any> {
    return this.baseApiService.post<any>(
      API_ENDPOINTS.SWEET_PURCHASE(id),
      purchaseData
    );
  }

  /**
   * Restock sweet
   */
  restockSweet(id: number, restockData: SweetRestock): Observable<Sweet> {
    return this.baseApiService
      .post<any>(API_ENDPOINTS.SWEET_RESTOCK(id), restockData)
      .pipe(map(response => response.data));
  }
}
