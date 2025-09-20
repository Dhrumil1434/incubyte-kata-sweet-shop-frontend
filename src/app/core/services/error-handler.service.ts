import { Injectable } from '@angular/core';
import { ValidationError } from '../models/validation.model';
import { ApiError } from '../models/api-response.model';

export interface FormFieldErrors {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  /**
   * Handle validation errors
   */
  showValidationError(errors: ValidationError[]): FormFieldErrors {
    console.warn('Validation errors:', errors);

    const fieldErrors: FormFieldErrors = {};

    // Convert validation errors to field errors
    errors.forEach(error => {
      const fieldName = error.path[0] as string;
      if (fieldName) {
        fieldErrors[fieldName] = error.message;
      }
      console.warn(`Field ${error.path.join('.')}: ${error.message}`);
    });

    return fieldErrors;
  }

  /**
   * Handle server errors
   */
  showServerError(): void {
    console.error('Server error occurred');
    // this.toastService.showError('Server error occurred. Please try again later.');
  }

  /**
   * Handle API errors
   */
  showApiError(error: ApiError): void {
    console.error('API Error:', error);

    // Show the main error message
    // this.toastService.showError(error.message);

    // Log detailed errors if available
    if (error.errors && error.errors.length > 0) {
      error.errors.forEach(err => {
        console.warn(`Field ${err.field}: ${err.message}`);
      });
    }
  }

  /**
   * Handle network errors
   */
  showNetworkError(): void {
    console.error('Network error occurred');
    // this.toastService.showError('Network error. Please check your connection.');
  }

  /**
   * Handle authentication errors
   */
  showAuthError(message: string = 'Authentication failed'): void {
    console.error('Authentication error:', message);
    // this.toastService.showError(message);
  }

  /**
   * Handle permission errors
   */
  showPermissionError(): void {
    console.error('Permission denied');
    // this.toastService.showError('You do not have permission to perform this action.');
  }
}
