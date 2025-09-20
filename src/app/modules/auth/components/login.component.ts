import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import {
  UserLoginDto,
  userLoginSchemaDto,
} from '../../../../assets/schemas/auth.schema';
import { ValidationService } from '../../../core/services/validation.service';
import {
  ErrorHandlerService,
  FormFieldErrors,
} from '../../../core/services/error-handler.service';
import { LoaderService } from '../../../core/services/loader.service';
import { AuthService } from '../services/auth.service';
import { AuthService as CoreAuthService } from '../../../core/services/auth.service';
import { CommonLoaderButtonComponent } from '../../../shared/components/common-loader-button/common-loader-button.component';
import { ROLES } from '../../../core/constants/role.constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CommonLoaderButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  loginResult: any = null;
  fieldErrors: FormFieldErrors = {};

  // Password visibility toggle
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private coreAuthService: CoreAuthService,
    private validationService: ValidationService,
    private errorHandler: ErrorHandlerService,
    private loaderService: LoaderService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    // Real-time validation with Zod
    this.setupRealTimeValidation();

    // Check for access denied error from query params
    this.checkForAccessDeniedError();
  }

  private setupRealTimeValidation() {
    // Watch form changes and validate with Zod (only when form is touched)
    this.loginForm.valueChanges.subscribe(formValue => {
      // Only validate if form has been touched or submitted to avoid premature validation
      if (this.loginForm.touched || this.isSubmitting) {
        this.validateFormWithZod(formValue);
      }
    });
  }

  private validateFormWithZod(formValue: any) {
    const result = this.validationService.validate(
      formValue,
      userLoginSchemaDto
    );

    if (!result.success) {
      // Clear previous errors
      this.clearAllErrors();

      // Update field errors for display (no toast for real-time validation)
      this.fieldErrors = this.errorHandler.showValidationError(result.errors);

      // Set new errors for each field
      result.errors.forEach(error => {
        const fieldName = error.path[0] as string;
        const control = this.loginForm.get(fieldName);

        if (control) {
          control.setErrors({
            zod: { message: error.message },
          });
        }
      });
    } else {
      // Clear field errors if validation passes
      this.fieldErrors = {};
    }
  }

  private clearAllErrors() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control) {
        control.setErrors(null);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  getFieldError(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control && control.errors) {
      if (control.errors['zod']) {
        return control.errors['zod'].message;
      }
      // Fallback to Angular validators
      if (control.errors['required']) return 'This field is required';
      if (control.errors['email']) return 'Invalid email format';
      if (control.errors['minlength'])
        return `Minimum length is ${control.errors['minlength'].requiredLength}`;
    }
    return '';
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.loginResult = null;

    try {
      const loginData: UserLoginDto = this.loginForm.value;

      // Final validation before API call
      const validationResult = this.validationService.validate(
        loginData,
        userLoginSchemaDto
      );

      if (!validationResult.success) {
        this.handleValidationErrors(validationResult.errors);
        return;
      }

      console.log('Making API call with data:', loginData);

      // API call - interceptors handle everything automatically!
      const response = await firstValueFrom(this.authService.login(loginData));

      // Handle success
      console.log('Login successful:', response);
      this.loginResult = {
        success: true,
        message: 'Login successful!',
        data: response,
      };

      // Show success message
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Login successful! Welcome to Kata Sweet Shop.',
      });

      // Redirect based on user role
      setTimeout(() => {
        const user = this.coreAuthService.getCurrentUser();

        if (user?.userType === ROLES.ADMIN) {
          this.router.navigate(['/admin']);
        } else if (user?.userType === ROLES.CUSTOMER) {
          this.router.navigate(['/customer']);
        } else {
          this.router.navigate(['/auth/login']);
        }
      }, 1500);
    } catch (error: any) {
      console.error('Login failed:', error);
      this.loginResult = {
        success: false,
        message:
          error?.error?.message ||
          error?.message ||
          'Login failed. Please check your credentials.',
        error: error,
      };

      // Show error message
      this.messageService.add({
        severity: 'error',
        summary: 'Login Failed',
        detail:
          error?.error?.message ||
          error?.message ||
          'Please check your credentials and try again.',
      });
    } finally {
      this.isSubmitting = false;
    }
  }

  private handleValidationErrors(errors: any[]) {
    console.warn('Validation errors:', errors);
    this.loginResult = {
      success: false,
      message: 'Validation failed',
      errors: errors,
    };
  }

  // Password visibility toggle
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Check for access denied error from query params
  private checkForAccessDeniedError() {
    // This can be implemented to check for access denied errors from query params
    // For now, it's a placeholder
  }

  // Sign up navigation
  onSignUp() {
    this.router.navigate(['/auth/register']);
  }

  // Track by function for error lists
  trackByError(index: number, error: any): any {
    return error.message || index;
  }
}
