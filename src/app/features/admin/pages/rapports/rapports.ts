import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { RapportService } from '../../services/rapport.service';
import type { PageResponse } from '../../services/rapport.service';
import { RapportMensuel } from '../../../../models/rapport.model';
import { selectIsLoading, selectRole } from '../../../auth/store/auth.selectors';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { TableComponent, TableColumn, TableAction } from '../../../../shared/components/table/table';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { RapportGenererFormComponent } from '../../components/rapport-generer-form/rapport-generer-form';
import { CurrencyPipe } from '../../../../core/pipes/currency.pipe';
import { ToastService } from '../../../../core/services/toast.service';
import { getHttpErrorMessage } from '../../../../core/utils/error.utils';

const MOIS_LABELS: Record<number, string> = {
  1: 'Janv.', 2: 'Fév.', 3: 'Mars', 4: 'Avr.', 5: 'Mai', 6: 'Juin',
  7: 'Juil.', 8: 'Août', 9: 'Sept.', 10: 'Oct.', 11: 'Nov.', 12: 'Déc.'
};

@Component({
  selector: 'app-rapports',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent,
    TableComponent,
    PaginationComponent,
    ConfirmDialogComponent,
    RapportGenererFormComponent
  ],
  providers: [CurrencyPipe],
  templateUrl: './rapports.html',
  styleUrl: './rapports.css'
})
export class RapportsComponent implements OnInit {
  private rapportService = inject(RapportService);
  private store = inject(Store);
  private currencyPipe = inject(CurrencyPipe);
  private toast = inject(ToastService);

  connectedRole$ = this.store.select(selectRole);
  authLoading$ = this.store.select(selectIsLoading);

  rapports: RapportMensuel[] = [];
  displayData: Array<RapportMensuel & { moisAnnee: string; chiffreAffairesFormatted: string; coutTotalFormatted: string; beneficeFormatted: string; tauxFormatted: string }> = [];
  loading = false;

  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  showModal = false;
  showDeleteConfirm = false;
  rapportToDeleteId: number | null = null;
  showDetailModal = false;
  selectedRapport: RapportMensuel | null = null;

  tableColumns: TableColumn[] = [
    { key: 'moisAnnee', label: 'Période', width: '15%' },
    { key: 'chiffreAffairesFormatted', label: 'Chiffre d\'affaires', width: '20%' },
    { key: 'coutTotalFormatted', label: 'Coût total', width: '20%' },
    { key: 'beneficeFormatted', label: 'Bénéfice', width: '18%' },
    { key: 'tauxFormatted', label: 'Taux rentabilité', width: '15%' }
  ];

  tableActions: TableAction[] = [
    {
      label: 'Voir',
      icon: 'visibility',
      class: 'rounded-lg border border-primary/20 p-2 text-primary transition-colors hover:bg-primary/10',
      callback: (item: any) => this.openDetail(this.rapports.find(r => r.id === item.id)!)
    },
    {
      label: 'Supprimer',
      icon: 'delete',
      class: 'rounded-lg border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50',
      callback: (item: any) => this.openDeleteConfirm(item.id)
    }
  ];

  ngOnInit(): void {
    this.loadRapports();
  }

  loadRapports(): void {
    this.loading = true;

    this.rapportService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (response: PageResponse<RapportMensuel>) => {
        this.rapports = response.content;
        this.displayData = response.content.map(r => ({
          ...r,
          moisAnnee: `${MOIS_LABELS[r.mois] ?? r.mois} ${r.annee}`,
          chiffreAffairesFormatted: this.currencyPipe.transform(r.chiffreAffaires ?? 0),
          coutTotalFormatted: this.currencyPipe.transform(r.coutTotal ?? 0),
          beneficeFormatted: this.currencyPipe.transform(r.benefice ?? 0),
          tauxFormatted: r.tauxRentabilite != null ? `${r.tauxRentabilite.toFixed(1)}%` : '-'
        }));
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadRapports();
  }

  openGenerateModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSuccess(): void {
    this.toast.showSuccess('Rapport généré.');
    this.closeModal();
    this.loadRapports();
  }

  onFormError(message: string): void {
    this.toast.showError(message);
  }

  openDetail(rapport: RapportMensuel): void {
    this.selectedRapport = rapport;
    this.showDetailModal = true;
  }

  closeDetail(): void {
    this.showDetailModal = false;
    this.selectedRapport = null;
  }

  openDeleteConfirm(id: number): void {
    this.rapportToDeleteId = id;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.rapportToDeleteId = null;
  }

  confirmDelete(): void {
    const id = this.rapportToDeleteId;
    if (id == null) return;
    this.closeDeleteConfirm();
    this.rapportService.delete(id).subscribe({
      next: () => {
        this.toast.showSuccess('Rapport supprimé.');
        this.loadRapports();
      },
      error: err => this.toast.showError(getHttpErrorMessage(err))
    });
  }

  formatCurrency(value: number): string {
    return this.currencyPipe.transform(value ?? 0);
  }
}
