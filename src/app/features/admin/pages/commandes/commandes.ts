import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { CommandeService, CommandeFilters, PageResponse } from '../../../user/services/commande.service';
import { CommandeResponse, StatutCommande } from '../../../../models/commande.model';
import { selectIsLoading, selectRole } from '../../../auth/store/auth.selectors';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { TableComponent, TableColumn } from '../../../../shared/components/table/table';
import { FilterBarComponent, FilterField } from '../../../../shared/components/filter-bar/filter-bar';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { CurrencyPipe } from '../../../../core/pipes/currency.pipe';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent,
    TableComponent,
    FilterBarComponent,
    PaginationComponent
  ],
  providers: [CurrencyPipe],
  templateUrl: './commandes.html',
  styleUrl: './commandes.css'
})
export class CommandesComponent implements OnInit {
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
    { key: 'date', label: 'Date', width: '15%' },
    { key: 'statut', label: 'Statut', width: '15%' },
    { key: 'utilisateur', label: 'Client', width: '25%' },
    { key: 'totalFormatted', label: 'Total', width: '20%' }
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

    const commandeFilters: CommandeFilters = {
      page: this.currentPage,
      size: this.pageSize,
      statut,
      from,
      to,
      minTotal,
      maxTotal
    };

    this.commandeService.getAllCommandes(commandeFilters).subscribe({
      next: (response: PageResponse<CommandeResponse>) => {
        this.commandes = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;

        this.displayCommandes = this.commandes.map(c => ({
          ...c,
          date: this.formatDate(c.date),
          utilisateur: c.utilisateur?.username ?? '-',
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
}
