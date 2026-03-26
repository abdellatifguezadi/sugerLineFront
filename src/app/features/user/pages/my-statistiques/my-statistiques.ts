import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { StatisticsService } from '../../../admin/services/statistics.service';
import { UserStatistics } from '../../../../models/statistics.model';
import { selectIsLoading, selectRole } from '../../../auth/store/auth.selectors';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { LoadingComponent } from '../../../../shared/components/loading/loading';
import { StatusChartComponent } from '../../../admin/components/status-chart/status-chart';
import { ToastService } from '../../../../core/services/toast.service';
import { getHttpErrorMessage } from '../../../../core/utils/error.utils';

@Component({
  selector: 'app-my-statistiques',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent,
    LoadingComponent,
    StatusChartComponent
  ],
  templateUrl: './my-statistiques.html',
  styleUrl: './my-statistiques.css'
})
export class MyStatistiquesComponent implements OnInit {
  private store = inject(Store);
  private statisticsService = inject(StatisticsService);
  private toast = inject(ToastService);

  sidebarOpen = false;

  connectedRole$ = this.store.select(selectRole);
  authLoading$ = this.store.select(selectIsLoading);

  stats: UserStatistics | null = null;
  loading = false;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    this.statisticsService.getMesStatistiques().subscribe({
      next: (data) => {
        this.stats = this.normalizeChartData(data);
        this.loading = false;
      },
      error: (err) => {
        this.toast.showError(getHttpErrorMessage(err));
        this.loading = false;
      }
    });
  }

  private normalizeChartData(data: UserStatistics): UserStatistics {
    return {
      ...data,
      mesCommandesParStatut: (data.mesCommandesParStatut || []).map((d: any) => ({
        label: d.label,
        value: d.value ?? null,
        count: d.count ?? d.value ?? 0
      })),
      mesPaiementsParStatut: (data.mesPaiementsParStatut || []).map((d: any) => ({
        label: d.label,
        value: d.value ?? null,
        count: d.count ?? d.value ?? 0
      }))
    };
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(value ?? 0);
  }

  formatPercent(value: number): string {
    return `${(value ?? 0) > 0 ? '+' : ''}${(value ?? 0).toFixed(1)}%`;
  }
}
