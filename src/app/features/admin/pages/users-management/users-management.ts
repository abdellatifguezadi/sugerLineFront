import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../../models/auth.model';
import { selectIsLoading, selectRole } from '../../../auth/store/auth.selectors';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { UserFormComponent } from '../../components/user-form/user-form';
import { TableComponent, TableColumn } from '../../../../shared/components/table/table';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { getHttpErrorMessage } from '../../../../core/utils/error.utils';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent,
    UserFormComponent,
    TableComponent,
    PaginationComponent
  ],
  templateUrl: './users-management.html',
  styleUrl: './users-management.css'
})
export class UsersManagementComponent implements OnInit {
  private store = inject(Store);
  private authService = inject(AuthService);

  connectedRole$ = this.store.select(selectRole);
  authLoading$ = this.store.select(selectIsLoading);

  users: User[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;

  currentPage = 0;
  pageSize = 5;
  totalElements = 0;
  totalPages = 0;

  showModal = false;

  tableColumns: TableColumn[] = [
    { key: 'username', label: 'Username', width: '20%' },
    { key: 'email', label: 'Email', width: '25%' },
    { key: 'fullName', label: 'Nom complet', width: '30%' },
    { key: 'role', label: 'Rôle', width: '25%' }
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.authService.getAllUsers(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.users = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.loading = false;
      },
      error: err => {
        this.error = getHttpErrorMessage(err);
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  openCreateModal(): void {
    this.error = null;
    this.success = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSuccess(message: string): void {
    this.success = message;
    this.closeModal();
    this.loadUsers();
  }

  onError(message: string): void {
    this.error = message;
  }
}
