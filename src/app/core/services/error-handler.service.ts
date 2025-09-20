import { Injectable } from '@angular/core';
import { ValidationError } from '../models/validation.model';
// import { ApiError } from '../models/api-response.model';
import { MessageService } from 'primeng/api';

export interface FormFieldErrors {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private messageService: MessageService) {}
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
   * Handle API errors with user-friendly messages
   */
  showApiError(error: any): void {
    console.error('API Error:', error);

    let message = 'An unexpected error occurred. Please try again.';
    let summary = 'Error';

    // Extract message from different error structures
    if (error?.error?.message) {
      message = error.error.message;
    } else if (error?.error?.data?.message) {
      message = error.error.data.message;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.error?.errors && Array.isArray(error.error.errors)) {
      // Handle validation errors array
      const validationErrors = error.error.errors
        .map((err: any) => err.message)
        .join(', ');
      message = validationErrors;
      summary = 'Validation Error';
    }

    // Show the error message to user
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: message,
      life: 5000,
    });

    // Log detailed errors if available
    if (error?.error?.errors && Array.isArray(error.error.errors)) {
      error.error.errors.forEach((err: any) => {
        console.warn(`Field ${err.field || 'unknown'}: ${err.message}`);
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
