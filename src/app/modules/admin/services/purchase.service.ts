import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from '../../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

export interface Purchase {
  id: number;
  userId: number;
  sweetId: number;
  quantity: number;
  purchasedAt: string;
  createdAt: string;
  updatedAt: string;
  sweet?: {
    id: number;
    name: string;
    price: string;
    category: {
      id: number;
      name: string;
    };
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface PurchaseCreate {
  sweetId: number;
  quantity: number;
}

export interface PurchaseListQuery {
  page?: number;
  limit?: number;
  sortBy?: 'id' | 'purchasedAt' | 'quantity';
  sortOrder?: 'asc' | 'desc';
  userId?: number;
  sweetId?: number;
  startDate?: string;
  endDate?: string;
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
export class PurchaseService {
  constructor(private baseApiService: BaseApiService) {}

  /**
   * Create a new purchase
   */
  createPurchase(purchaseData: PurchaseCreate): Observable<Purchase> {
    return this.baseApiService
      .post<any>(API_ENDPOINTS.PURCHASES, purchaseData)
      .pipe(map(response => response.data));
  }

  /**
   * Get list of purchases with pagination and filters
   */
  getPurchases(
    query: PurchaseListQuery = {}
  ): Observable<PaginatedResponse<Purchase>> {
    const params = new URLSearchParams();

    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);
    if (query.userId) params.append('userId', query.userId.toString());
    if (query.sweetId) params.append('sweetId', query.sweetId.toString());
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.PURCHASES}?${queryString}`
      : API_ENDPOINTS.PURCHASES;

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
   * Get purchase by ID
   */
  getPurchaseById(id: number): Observable<Purchase> {
    return this.baseApiService
      .get<any>(`${API_ENDPOINTS.PURCHASES}/${id}`)
      .pipe(map(response => response.data));
  }

  /**
   * Get purchases by user ID
   */
  getPurchasesByUser(
    userId: number,
    query: PurchaseListQuery = {}
  ): Observable<PaginatedResponse<Purchase>> {
    const params = new URLSearchParams();

    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);
    if (query.sweetId) params.append('sweetId', query.sweetId.toString());
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.PURCHASES_BY_USER(userId)}?${queryString}`
      : API_ENDPOINTS.PURCHASES_BY_USER(userId);

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
   * Get purchases by sweet ID (admin only)
   */
  getPurchasesBySweet(
    sweetId: number,
    query: PurchaseListQuery = {}
  ): Observable<PaginatedResponse<Purchase>> {
    const params = new URLSearchParams();

    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);
    if (query.userId) params.append('userId', query.userId.toString());
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.PURCHASES_BY_SWEET(sweetId)}?${queryString}`
      : API_ENDPOINTS.PURCHASES_BY_SWEET(sweetId);

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
}
