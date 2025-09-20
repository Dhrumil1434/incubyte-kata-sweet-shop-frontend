import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from '../../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserListQuery {
  page?: number;
  limit?: number;
  sortBy?: 'id' | 'name' | 'email' | 'role' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  name?: string;
  email?: string;
  role?: 'admin' | 'customer';
  isActive?: boolean;
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
export class UserService {
  constructor(private baseApiService: BaseApiService) {}

  /**
   * Get list of users with pagination and filters
   */
  getUsers(query: UserListQuery = {}): Observable<PaginatedResponse<User>> {
    const params = new URLSearchParams();

    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);
    if (query.name) params.append('name', query.name);
    if (query.email) params.append('email', query.email);
    if (query.role) params.append('role', query.role);
    if (query.isActive !== undefined)
      params.append('isActive', query.isActive.toString());

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.USERS}?${queryString}`
      : API_ENDPOINTS.USERS;

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
   * Get user by ID
   */
  getUserId(id: number): Observable<User> {
    return this.baseApiService
      .get<any>(`${API_ENDPOINTS.USERS}/${id}`)
      .pipe(map(response => response.data));
  }

  /**
   * Update user
   */
  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.baseApiService
      .put<any>(`${API_ENDPOINTS.USERS}/${id}`, userData)
      .pipe(map(response => response.data));
  }

  /**
   * Delete user (soft delete)
   */
  deleteUser(id: number): Observable<any> {
    return this.baseApiService.delete(`${API_ENDPOINTS.USERS}/${id}`);
  }

  /**
   * Reactivate user
   */
  reactivateUser(id: number): Observable<User> {
    return this.baseApiService
      .post<any>(`${API_ENDPOINTS.USERS}/${id}/reactivate`, {})
      .pipe(map(response => response.data));
  }
}
