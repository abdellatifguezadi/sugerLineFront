import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { PaiementService, PaiementFilters, PageResponse } from '../../services/paiement.service';
import { PaiementWithCommande, StatutPaiement } from '../../../../models/paiement.model';
import { selectIsLoading, selectRole } from '../../../auth/store/auth.selectors';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { PaiementTableComponent } from '../../components/paiement-table/paiement-table';
import { FilterBarComponent, FilterField } from '../../../../shared/components/filter-bar/filter-bar';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { ToastService } from '../../../../core/services/toast.service';
import { getHttpErrorMessage } from '../../../../core/utils/error.utils';

@Component({
  selector: 'app-my-payments',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent,
    PaiementTableComponent,
    FilterBarComponent,
    PaginationComponent
  ],
  templateUrl: './my-payments.html',
  styleUrl: './my-payments.css'
})
export class MyPaymentsComponent implements OnInit {
  private paiementService = inject(PaiementService);
  private store = inject(Store);
  private toast = inject(ToastService);

  sidebarOpen = false;

  connectedRole$ = this.store.select(selectRole);
  authLoading$ = this.store.select(selectIsLoading);

  paiements: PaiementWithCommande[] = [];
  loading = false;

  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  filters: Record<string, unknown> = {};
  filterFields: FilterField[] = [
    {
      key: 'statut',
      label: 'Statut',
      type: 'select',
      options: [
        { value: StatutPaiement.EN_ATTENTE, label: 'En attente' },
        { value: StatutPaiement.ACCEPTE, label: 'Accepté' },
        { value: StatutPaiement.ANNULE, label: 'Annulé' }
      ]
    }
  ];

  tableActions = [
    {
      label: 'View',
      icon: 'visibility',
      class: 'rounded-lg border border-blue-200 p-2 text-blue-600 transition-colors hover:bg-blue-50',
      callback: (_item: PaiementWithCommande) => {}
    }
  ];

  ngOnInit(): void {
    this.loadPaiements();
  }

  loadPaiements(): void {
    this.loading = true;

    const statut = (this.filters['statut'] as string)?.trim() || undefined;

    const filters: PaiementFilters = {
      page: this.currentPage,
      size: this.pageSize,
      statut
    };

    this.paiementService.getMyPaiements(filters).subscribe({
      next: (response: PageResponse<PaiementWithCommande>) => {
        this.paiements = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.loading = false;
      },
      error: err => {
        this.toast.showError(getHttpErrorMessage(err));
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadPaiements();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 0;
    this.loadPaiements();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPaiements();
  }
}
