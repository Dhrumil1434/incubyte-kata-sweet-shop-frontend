import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';

import { AuthService } from '../services/auth.service';
import {
  ErrorHandlerService,
  FormFieldErrors,
} from '../../../core/services/error-handler.service';
import { LoaderService } from '../../../core/services/loader.service';
import { ValidationService } from '../../../core/services/validation.service';
import { CommonLoaderButtonComponent } from '../../../shared/components/common-loader-button/common-loader-button.component';
import { UserRegisterDto } from '../../../../assets/schemas/auth.schema';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ToastModule,
    InputTextModule,
    PasswordModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    DividerModule,
    CheckboxModule,
    ProgressBarModule,
    CommonLoaderButtonComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  fieldErrors: FormFieldErrors = {};
  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;
  passwordStrength = 0;
  passwordStrengthLabel = '';

  // Role options for dropdown
  roleOptions = [
    { label: 'Customer', value: 'customer' },
    { label: 'Admin', value: 'admin' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService,
    private loaderService: LoaderService,
    private validationService: ValidationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupRealTimeValidation();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(255)],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(128),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      role: ['customer', [Validators.required]],
      termsAccepted: [false, [Validators.requiredTrue]],
    });

    // Add custom validator for password confirmation
    this.registerForm.addValidators(this.passwordMatchValidator.bind(this));
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  private setupRealTimeValidation(): void {
    // Only validate if form is touched or submitted
    if (this.registerForm.touched || this.isSubmitting) {
      this.validateFormWithZod();
    }
  }

  private validateFormWithZod(): void {
    if (this.registerForm.valid) {
      try {
        const formData = this.registerForm.value;
        this.validationService.validateData(
          formData,
          this.authService['userRegisterSchemaDto']
        );
        this.fieldErrors = {};
      } catch (error) {
        this.fieldErrors = this.errorHandler.showValidationError(error);
      }
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onPasswordChange(): void {
    const password = this.registerForm.get('password')?.value || '';
    this.calculatePasswordStrength(password);
    this.setupRealTimeValidation();
  }

  private calculatePasswordStrength(password: string): void {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    };

    strength = Object.values(checks).filter(Boolean).length;
    this.passwordStrength = (strength / 5) * 100;

    if (strength <= 2) {
      this.passwordStrengthLabel = 'Weak';
    } else if (strength <= 3) {
      this.passwordStrengthLabel = 'Fair';
    } else if (strength <= 4) {
      this.passwordStrengthLabel = 'Good';
    } else {
      this.passwordStrengthLabel = 'Strong';
    }
  }

  getPasswordStrengthColor(): string {
    if (this.passwordStrength <= 40) return 'var(--red-500)';
    if (this.passwordStrength <= 60) return 'var(--orange-500)';
    if (this.passwordStrength <= 80) return 'var(--yellow-500)';
    return 'var(--green-500)';
  }

  onSubmit(): void {
    this.isSubmitting = true;
    this.fieldErrors = {};

    if (this.registerForm.valid) {
      try {
        const formData = this.registerForm.value;
        const registerData: UserRegisterDto = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };

        this.authService.registerUser(registerData).subscribe({
          next: _response => {
            this.isSubmitting = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Registration Successful',
              detail: 'Account created successfully! Please login to continue.',
              life: 5000,
            });

            // Redirect to login page after successful registration
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 2000);
          },
          error: error => {
            this.isSubmitting = false;
            this.errorHandler.handleError(error);
          },
        });
      } catch (error) {
        this.isSubmitting = false;
        this.fieldErrors = this.errorHandler.showValidationError(error);
      }
    } else {
      this.isSubmitting = false;
      this.validateFormWithZod();
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fix the errors in the form before submitting.',
        life: 5000,
      });
    }
  }

  onLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  trackByError(index: number, error: any): any {
    return error;
  }
}
