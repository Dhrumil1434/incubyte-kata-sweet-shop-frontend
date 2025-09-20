import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role } from '../constants/role.constants';
import { AuthService } from '../services/auth.service';

export const RoleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return _route => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const currentUser = authService.getCurrentUser();

    if (currentUser && allowedRoles.includes(currentUser.userType)) {
      return true;
    } else {
      // Redirect to a forbidden page or login
      router.navigate(['/auth/login']); // Or '/forbidden'
      return false;
    }
  };
};

export const AdminGuard: CanActivateFn = RoleGuard(['admin']);
export const CustomerGuard: CanActivateFn = RoleGuard(['customer']);
