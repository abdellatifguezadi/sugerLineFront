import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../auth/store/auth.actions';
import * as StatisticsActions from '../store/statistics.actions';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';
import { selectIsLoading, selectRole } from '../../auth/store/auth.selectors';
import { selectStatisticsData, selectStatisticsLoading } from '../store/statistics.selectors';
import { StatusChartComponent } from '../components/status-chart/status-chart';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    StatusChartComponent
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  connectedRole$ = this.store.select(selectRole);
  authLoading$ = this.store.select(selectIsLoading);
  stats$ = this.store.select(selectStatisticsData);
  statsLoading$ = this.store.select(selectStatisticsLoading);

  ngOnInit(): void {
    this.store.dispatch(StatisticsActions.loadStatistics());
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/login']);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(value);
  }

  formatPercent(value: number): string {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  }
}
