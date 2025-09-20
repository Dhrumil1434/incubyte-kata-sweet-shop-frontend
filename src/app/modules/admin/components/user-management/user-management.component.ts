import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';

import { UserService, User, UserListQuery } from '../../services/user.service';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    TagModule,
    SelectModule,
    ToastModule,
    ConfirmationModalComponent,
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data
  users: User[] = [];
  selectedUsers: User[] = [];

  // UI State
  isLoading = false;
  showDeleteModal = false;
  showReactivateModal = false;

  // Form Data
  selectedUser: User | null = null;

  // Filters
  filters: UserListQuery = {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  };

  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalRecords = 0;
  rowsPerPage = 10;

  // Role options
  roleOptions = [
    { label: 'All Roles', value: '' },
    { label: 'Admin', value: 'admin' },
    { label: 'Customer', value: 'customer' },
  ];

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Data Loading
  loadUsers(): void {
    this.isLoading = true;
    this.userService
      .getUsers(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.users = response.data;
          this.currentPage = response.pagination.page;
          this.totalPages = response.pagination.totalPages;
          this.totalRecords = response.pagination.total;
          this.isLoading = false;
        },
        error: error => {
          console.error('Error loading users:', error);
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load users. Please try again.',
          });
        },
      });
  }

  // Filter Methods
  onSearchChange(): void {
    this.filters.page = 1;
    this.loadUsers();
  }

  onRoleChange(): void {
    this.filters.page = 1;
    this.loadUsers();
  }

  onSortChange(): void {
    this.filters.page = 1;
    this.loadUsers();
  }

  clearFilters(): void {
    this.filters = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    this.loadUsers();
  }

  // Pagination
  onPageChange(event: any): void {
    this.filters.page = event.page + 1;
    this.filters.limit = event.rows;
    this.loadUsers();
  }

  // Modal Methods
  openDeleteModal(user: User): void {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  openReactivateModal(user: User): void {
    this.selectedUser = user;
    this.showReactivateModal = true;
  }

  closeModals(): void {
    this.showDeleteModal = false;
    this.showReactivateModal = false;
    this.selectedUser = null;
  }

  // CRUD Operations
  onConfirmDelete(): void {
    if (!this.selectedUser) return;

    this.userService
      .deleteUser(this.selectedUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'User Deleted',
            detail: `${this.selectedUser?.name} has been deleted successfully.`,
          });
          this.closeModals();
          this.loadUsers();
        },
        error: error => {
          console.error('Error deleting user:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete user. Please try again.',
          });
        },
      });
  }

  onConfirmReactivate(): void {
    if (!this.selectedUser) return;

    this.userService
      .reactivateUser(this.selectedUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'User Reactivated',
            detail: `${this.selectedUser?.name} has been reactivated successfully.`,
          });
          this.closeModals();
          this.loadUsers();
        },
        error: error => {
          console.error('Error reactivating user:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to reactivate user. Please try again.',
          });
        },
      });
  }

  // Utility Methods
  getRoleSeverity(role: string): string {
    return role === 'admin' ? 'danger' : 'info';
  }

  getStatusSeverity(isActive: boolean): string {
    return isActive ? 'success' : 'secondary';
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }
}
