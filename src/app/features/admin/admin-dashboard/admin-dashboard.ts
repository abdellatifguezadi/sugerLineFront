import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../auth/store/auth.actions';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';
import { selectIsLoading, selectRole } from '../../auth/store/auth.selectors';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardComponent {
  private store = inject(Store);
  private router = inject(Router);

  connectedRole$ = this.store.select(selectRole);
  isLoading$ = this.store.select(selectIsLoading);


  logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/login']);
  }
}
