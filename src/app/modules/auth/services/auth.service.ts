import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  LoginApiResponse,
  loginApiResponseSchema,
  LoginResponse,
  UserLoginDto,
  UserRegisterDto,
  userLoginSchemaDto,
  userRegisterSchemaDto,
} from '../../../../assets/schemas/auth.schema';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import {
  AuthTokens,
  AuthService as CoreAuthService,
  UserData,
} from '../../../core/services/auth.service';
import { BaseApiService } from '../../../core/services/base-api.service';
import { ValidationService } from '../../../core/services/validation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private baseApiService: BaseApiService,
    private coreAuthService: CoreAuthService,
    private validationService: ValidationService
  ) {}

  /**
   * User login - interceptors handle everything automatically!
   */
  login(loginData: UserLoginDto): Observable<LoginApiResponse> {
    // 1. Final validation before API call (interceptor will also validate)
    const validationResult = this.validationService.validate(
      loginData,
      userLoginSchemaDto
    );

    if (!validationResult.success) {
      return throwError(() => new Error('Validation failed'));
    }

    // 2. Make API call - interceptors handle the rest!
    return this.baseApiService
      .post<LoginResponse>(API_ENDPOINTS.LOGIN, loginData)
      .pipe(
        // 3. Validate response (interceptor will also validate)
        tap(response => {
          const responseValidation = this.validationService.validate(
            response,
            loginApiResponseSchema
          );
          if (!responseValidation.success) {
            console.error(
              '❌ Response validation failed:',
              responseValidation.errors
            );
          }
        }),

        // 4. Handle successful login
        tap(response => {
          if (response.success && response.data) {
            this.handleLoginSuccess(response.data);
          }
        }),

        // 5. Handle errors
        catchError(error => {
          this.handleLoginError(error);
          return throwError(() => error);
        })
      );
  }

  /**
   * User logout
   */
  logout(): Observable<any> {
    return this.baseApiService.post(API_ENDPOINTS.LOGOUT, {}).pipe(
      tap(() => {
        this.coreAuthService.clearAuthData();
      }),
      catchError(error => {
        // Even if logout fails, clear local auth data
        this.coreAuthService.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<any> {
    const refreshToken = this.coreAuthService.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.baseApiService
      .post<any>(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.coreAuthService.updateAccessToken(response.data.accessToken);
          }
        })
      );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.coreAuthService.isAuthenticated();
  }

  /**
   * Get current user data
   */
  getCurrentUser(): UserData | null {
    return this.coreAuthService.getCurrentUser();
  }

  /**
   * Get current user as observable
   */
  getCurrentUser$(): Observable<UserData | null> {
    return this.coreAuthService.currentUser$;
  }

  /**
   * Check if token is expiring soon
   */
  isTokenExpiringSoon(): boolean {
    return this.coreAuthService.isTokenExpiringSoon();
  }

  // Private methods
  private handleLoginSuccess(loginData: LoginResponse): void {
    const userData: UserData = {
      userId: loginData.user.id,
      userName: loginData.user.name,
      email: loginData.user.email,
      firstName: loginData.user.name.split(' ')[0] || '',
      lastName: loginData.user.name.split(' ').slice(1).join(' ') || '',
      userType: loginData.user.role,
      profilePicture: '', // Backend doesn't provide profile picture yet
      email_verified: true, // Backend doesn't have email verification yet
      phone_verified: false, // Backend doesn't have phone verification yet
      admin_approved: loginData.user.role === 'admin',
    };

    const tokens: AuthTokens = {
      accessToken: loginData.accessToken,
      refreshToken: loginData.refreshToken,
    };

    this.coreAuthService.setAuthData(userData, tokens);
  }

  private handleLoginError(error: any): void {
    console.error('Login failed:', error);

    // Clear any existing auth data on error
    this.coreAuthService.clearAuthData();

    // You can add additional error handling here
    // e.g., show toast messages, track analytics, etc.
  }

  /**
   * Register a new user
   */
  registerUser(registerData: UserRegisterDto): Observable<any> {
    // Validate the registration data
    const validationResult = this.validationService.validate(
      registerData,
      userRegisterSchemaDto
    );

    if (!validationResult.success) {
      return throwError(() => new Error('Validation failed'));
    }

    return this.baseApiService.post(
      API_ENDPOINTS.REGISTER,
      registerData
    ).pipe(
      tap((response) => {
        console.log('Registration successful:', response);
        // Registration successful - user can now login
      }),
      catchError((error) => {
        this.handleRegistrationError(error);
        return throwError(() => error);
      })
    );
  }

  private handleRegistrationError(error: any): void {
    console.error('Registration failed:', error);

    // You can add additional error handling here
    // e.g., show toast messages, track analytics, etc.
  }
}
