import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { PaiementService } from '../../../user/services/paiement.service';
import type { PaiementFilters, PageResponse } from '../../../user/services/paiement.service';
import { PaiementWithCommande, StatutPaiement } from '../../../../models/paiement.model';
import { selectIsLoading, selectRole } from '../../../auth/store/auth.selectors';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { PaiementTableComponent } from '../../../user/components/paiement-table/paiement-table';
import { FilterBarComponent, FilterField } from '../../../../shared/components/filter-bar/filter-bar';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { getHttpErrorMessage } from '../../../../core/utils/error.utils';

@Component({
  selector: 'app-all-payments',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent,
    PaiementTableComponent,
    FilterBarComponent,
    PaginationComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './all-payments.html',
  styleUrl: './all-payments.css'
})
export class AllPaymentsComponent implements OnInit {
  private paiementService = inject(PaiementService);
  private store = inject(Store);

  connectedRole$ = this.store.select(selectRole);
  authLoading$ = this.store.select(selectIsLoading);

  paiements: PaiementWithCommande[] = [];
  loading = false;
  error: string | null = null;

  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  showAccepterConfirm = false;
  showAnnulerConfirm = false;
  paiementToAccepterId: number | null = null;
  paiementToAnnulerId: number | null = null;

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
      label: 'Accepter',
      icon: 'check_circle',
      class: 'rounded-lg border border-green-200 p-2 text-green-600 transition-colors hover:bg-green-50',
      callback: (item: PaiementWithCommande) => this.openAccepterConfirm(item.id),
      visible: (item: PaiementWithCommande) =>
        !!(item?.statut && String(item.statut).toUpperCase() === StatutPaiement.EN_ATTENTE)
    },
    {
      label: 'Annuler',
      icon: 'cancel',
      class: 'rounded-lg border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50',
      callback: (item: PaiementWithCommande) => this.openAnnulerConfirm(item.id),
      visible: (item: PaiementWithCommande) =>
        !!(item?.statut && String(item.statut).toUpperCase() === StatutPaiement.EN_ATTENTE)
    }
  ];

  ngOnInit(): void {
    this.loadPaiements();
  }

  loadPaiements(): void {
    this.loading = true;
    this.error = null;

    const statut = (this.filters['statut'] as string)?.trim() || undefined;

    const filters: PaiementFilters = {
      page: this.currentPage,
      size: this.pageSize,
      statut
    };

    this.paiementService.getAllPaiements(filters).subscribe({
      next: (response: PageResponse<PaiementWithCommande>) => {
        this.paiements = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.loading = false;
      },
      error: err => {
        this.error = getHttpErrorMessage(err);
        console.error(err);
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

  openAccepterConfirm(id: number): void {
    this.paiementToAccepterId = id;
    this.showAccepterConfirm = true;
  }

  closeAccepterConfirm(): void {
    this.showAccepterConfirm = false;
    this.paiementToAccepterId = null;
  }

  confirmAccepter(): void {
    const id = this.paiementToAccepterId;
    if (id == null) return;
    this.closeAccepterConfirm();
    this.paiementService.accepterPaiement(id).subscribe({
      next: () => this.loadPaiements(),
      error: err => {
        this.error = getHttpErrorMessage(err);
        console.error(err);
      }
    });
  }

  openAnnulerConfirm(id: number): void {
    this.paiementToAnnulerId = id;
    this.showAnnulerConfirm = true;
  }

  closeAnnulerConfirm(): void {
    this.showAnnulerConfirm = false;
    this.paiementToAnnulerId = null;
  }

  confirmAnnuler(): void {
    const id = this.paiementToAnnulerId;
    if (id == null) return;
    this.closeAnnulerConfirm();
    this.paiementService.annulerPaiement(id).subscribe({
      next: () => this.loadPaiements(),
      error: err => {
        this.error = getHttpErrorMessage(err);
        console.error(err);
      }
    });
  }
}
