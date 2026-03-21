import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { CommandeService, MyCommandeFilters, PageResponse } from '../../services/commande.service';
import { CommandeResponse, StatutCommande } from '../../../../models/commande.model';
import { selectIsLoading, selectRole } from '../../../auth/store/auth.selectors';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { TableComponent, TableColumn, TableAction } from '../../../../shared/components/table/table';
import { FilterBarComponent, FilterField } from '../../../../shared/components/filter-bar/filter-bar';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { CommandeDetailComponent } from '../../components/commande-detail/commande-detail';
import { CommandeFormComponent } from '../../components/commande-form/commande-form';
import { CurrencyPipe } from '../../../../core/pipes/currency.pipe';

@Component({
  selector: 'app-my-commandes',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent,
    TableComponent,
    FilterBarComponent,
    PaginationComponent,
    ConfirmDialogComponent,
    CommandeDetailComponent,
    CommandeFormComponent
  ],
  providers: [CurrencyPipe],
  templateUrl: './my-commandes.html',
  styleUrl: './my-commandes.css'
})
export class MyCommandesComponent implements OnInit {
  private commandeService = inject(CommandeService);
  private store = inject(Store);
  private currencyPipe = inject(CurrencyPipe);

  connectedRole$ = this.store.select(selectRole);
  authLoading$ = this.store.select(selectIsLoading);

  commandes: CommandeResponse[] = [];
  displayCommandes: any[] = [];
  loading = false;
  error: string | null = null;

  currentPage = 0;
  pageSize = 5;
  totalElements = 0;
  totalPages = 0;

  filters: any = {};
  filterFields: FilterField[] = [
    {
      key: 'statut',
      label: 'Statut',
      type: 'select',
      options: [
        { value: StatutCommande.EN_ATTENTE, label: 'En attente' },
        { value: StatutCommande.LIVREE, label: 'Livrée' },
        { value: StatutCommande.ANNULEE, label: 'Annulée' }
      ]
    },
    { key: 'from', label: 'Date début', type: 'date' },
    { key: 'to', label: 'Date fin', type: 'date' },
    { key: 'minTotal', label: 'Total min (MAD)', type: 'number', placeholder: '0', min: 0 },
    { key: 'maxTotal', label: 'Total max (MAD)', type: 'number', placeholder: '9999', min: 0 }
  ];

  tableColumns: TableColumn[] = [
    { key: 'date', label: 'Date', width: '20%' },
    { key: 'statut', label: 'Statut', width: '20%' },
    { key: 'totalFormatted', label: 'Total', width: '25%' }
  ];

  showDetailModal = false;
  showFormModal = false;
  showDeleteConfirm = false;
  selectedCommande: CommandeResponse | null = null;
  commandeToDeleteId: number | null = null;
  isEditMode = false;

  private onlyEnAttente = (item: any) => (item?.statut ?? '') === StatutCommande.EN_ATTENTE;

  tableActions: TableAction[] = [
    {
      label: 'Voir',
      icon: 'visibility',
      class: 'rounded-lg border border-blue-200 p-2 text-blue-600 transition-colors hover:bg-blue-50',
      callback: (item: CommandeResponse) => this.viewCommande(item)
    },
    {
      label: 'Modifier',
      icon: 'edit',
      class: 'rounded-lg border border-primary/20 p-2 text-primary transition-colors hover:bg-primary/10',
      callback: (item: CommandeResponse) => this.editCommande(item),
      visible: this.onlyEnAttente.bind(this)
    }
  ];

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.loading = true;
    this.error = null;

    const parseOptionalNumber = (value: unknown): number | undefined => {
      if (value === '' || value === null || value === undefined) return undefined;
      const n = typeof value === 'number' ? value : Number(value);
      return typeof n === 'number' && !isNaN(n) ? n : undefined;
    };

    const statut =
      typeof this.filters.statut === 'string' && this.filters.statut.trim().length > 0
        ? this.filters.statut.trim()
        : undefined;
    const from =
      typeof this.filters.from === 'string' && this.filters.from.trim().length > 0
        ? this.filters.from
        : undefined;
    const to =
      typeof this.filters.to === 'string' && this.filters.to.trim().length > 0
        ? this.filters.to
        : undefined;
    const minTotal = parseOptionalNumber(this.filters.minTotal);
    const maxTotal = parseOptionalNumber(this.filters.maxTotal);

    const filters: MyCommandeFilters = {
      page: this.currentPage,
      size: this.pageSize,
      statut,
      from,
      to,
      minTotal,
      maxTotal
    };

    this.commandeService.getMyCommandes(filters).subscribe({
      next: (response: PageResponse<CommandeResponse>) => {
        this.commandes = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;

        this.displayCommandes = this.commandes.map(c => ({
          ...c,
          date: this.formatDate(c.date),
          totalFormatted: this.currencyPipe.transform(c.total)
        }));

        this.loading = false;
      },
      error: err => {
        this.error = 'Erreur lors du chargement des commandes';
        console.error(err);
        this.loading = false;
      }
    });
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadCommandes();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 0;
    this.loadCommandes();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCommandes();
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedCommande = null;
    this.showFormModal = true;
  }

  viewCommande(commande: CommandeResponse): void {
    this.selectedCommande = this.commandes.find(c => c.id === commande.id) ?? commande;
    this.showDetailModal = true;
  }

  editCommande(commande: CommandeResponse): void {
    this.selectedCommande = this.commandes.find(c => c.id === commande.id) ?? commande;
    this.isEditMode = true;
    this.showFormModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedCommande = null;
  }

  closeFormModal(): void {
    this.showFormModal = false;
    this.selectedCommande = null;
    this.isEditMode = false;
  }

  openDeleteConfirm(id: number): void {
    this.commandeToDeleteId = id;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.commandeToDeleteId = null;
  }

  confirmDelete(): void {
    const id = this.commandeToDeleteId;
    if (id == null) return;
    this.closeDeleteConfirm();
    this.commandeService.annulerCommande(id).subscribe({
      next: () => this.loadCommandes(),
      error: err => {
        this.error = 'Erreur lors de la suppression';
        console.error(err);
      }
    });
  }

  onSubmit(formData: { date: string; commandeLines: { produitId: number; quantite: number }[] }): void {
    const payload = {
      date: formData.date,
      commandeLines: formData.commandeLines
    } as { date: string; commandeLines: { produitId: number; quantite: number }[] };
    if (this.isEditMode && this.selectedCommande) {
      this.commandeService.updateCommande(this.selectedCommande.id, payload).subscribe({
        next: () => {
          this.closeFormModal();
          this.loadCommandes();
        },
        error: err => {
          this.error = 'Erreur lors de la modification';
          console.error(err);
        }
      });
      return;
    }
    this.commandeService.createCommande(payload).subscribe({
      next: () => {
        this.closeFormModal();
        this.loadCommandes();
      },
      error: err => {
        this.error = 'Erreur lors de la création';
        console.error(err);
      }
    });
  }
}
