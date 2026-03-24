import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ChargesService } from '../../services/charges.service';
import type { PageResponse } from '../../services/charges.service';
import { ChargesMensuelles } from '../../../../models/charges.model';
import { selectIsLoading, selectRole } from '../../../auth/store/auth.selectors';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { TableComponent, TableColumn, TableAction } from '../../../../shared/components/table/table';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { ChargesFormComponent } from '../../components/charges-form/charges-form';
import { CurrencyPipe } from '../../../../core/pipes/currency.pipe';
import { ToastService } from '../../../../core/services/toast.service';
import { getHttpErrorMessage } from '../../../../core/utils/error.utils';

const MOIS_LABELS: Record<number, string> = {
  1: 'Janv.', 2: 'Fév.', 3: 'Mars', 4: 'Avr.', 5: 'Mai', 6: 'Juin',
  7: 'Juil.', 8: 'Août', 9: 'Sept.', 10: 'Oct.', 11: 'Nov.', 12: 'Déc.'
};

@Component({
  selector: 'app-charges',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent,
    TableComponent,
    PaginationComponent,
    ConfirmDialogComponent,
    ChargesFormComponent
  ],
  providers: [CurrencyPipe],
  templateUrl: './charges.html',
  styleUrl: './charges.css'
})
export class ChargesComponent implements OnInit {
  private chargesService = inject(ChargesService);
  private store = inject(Store);
  private currencyPipe = inject(CurrencyPipe);
  private toast = inject(ToastService);

  connectedRole$ = this.store.select(selectRole);
  authLoading$ = this.store.select(selectIsLoading);

  charges: ChargesMensuelles[] = [];
  displayData: Array<ChargesMensuelles & { moisAnnee: string; totalFormatted: string }> = [];
  loading = false;

  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  showModal = false;
  isEditMode = false;
  selectedCharges: ChargesMensuelles | null = null;
  showDeleteConfirm = false;
  chargesToDeleteId: number | null = null;

  tableColumns: TableColumn[] = [
    { key: 'moisAnnee', label: 'Période', width: '15%' },
    { key: 'electricite', label: 'Électricité', width: '12%' },
    { key: 'eau', label: 'Eau', width: '10%' },
    { key: 'salaires', label: 'Salaires', width: '12%' },
    { key: 'loyer', label: 'Loyer', width: '10%' },
    { key: 'autres', label: 'Autres', width: '10%' },
    { key: 'totalFormatted', label: 'Total', width: '15%' },
    { key: 'utilisateurUsername', label: 'Utilisateur', width: '16%' }
  ];

  tableActions: TableAction[] = [
    {
      label: 'Modifier',
      icon: 'edit',
      class: 'rounded-lg border border-primary/20 p-2 text-primary transition-colors hover:bg-primary/10',
      callback: (item: ChargesMensuelles & { moisAnnee: string; totalFormatted: string }) =>
        this.openEditModal(this.charges.find(c => c.id === item.id)!)
    },
    {
      label: 'Supprimer',
      icon: 'delete',
      class: 'rounded-lg border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50',
      callback: (item: ChargesMensuelles & { moisAnnee: string; totalFormatted: string }) =>
        this.openDeleteConfirm(item.id)
    }
  ];

  ngOnInit(): void {
    this.loadCharges();
  }

  loadCharges(): void {
    this.loading = true;

    this.chargesService.getAll({ page: this.currentPage, size: this.pageSize }).subscribe({
      next: (response: PageResponse<ChargesMensuelles>) => {
        this.charges = response.content;
        this.displayData = response.content.map(c => {
          const row = { ...c } as ChargesMensuelles & { moisAnnee: string; totalFormatted: string };
          row.moisAnnee = `${MOIS_LABELS[c.mois] ?? c.mois} ${c.annee}`;
          row.totalFormatted = this.currencyPipe.transform(c.total);
          (row as any).electricite = this.currencyPipe.transform(c.electricite);
          (row as any).eau = this.currencyPipe.transform(c.eau);
          (row as any).salaires = this.currencyPipe.transform(c.salaires);
          (row as any).loyer = this.currencyPipe.transform(c.loyer);
          (row as any).autres = this.currencyPipe.transform(c.autres ?? 0);
          return row;
        });
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
    this.loadCharges();
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedCharges = null;
    this.showModal = true;
  }

  openEditModal(charges: ChargesMensuelles): void {
    this.isEditMode = true;
    this.selectedCharges = charges;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCharges = null;
    this.isEditMode = false;
  }

  onSuccess(): void {
    this.toast.showSuccess('Charges enregistrées.');
    this.closeModal();
    this.loadCharges();
  }

  onFormError(message: string): void {
    this.toast.showError(message);
  }

  openDeleteConfirm(id: number): void {
    this.chargesToDeleteId = id;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.chargesToDeleteId = null;
  }

  confirmDelete(): void {
    const id = this.chargesToDeleteId;
    if (id == null) return;
    this.closeDeleteConfirm();
    this.chargesService.delete(id).subscribe({
      next: () => {
        this.toast.showSuccess('Charges supprimées.');
        this.loadCharges();
      },
      error: err => this.toast.showError(getHttpErrorMessage(err))
    });
  }
}
