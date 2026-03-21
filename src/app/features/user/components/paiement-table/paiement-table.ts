import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableColumn, TableAction } from '../../../../shared/components/table/table';
import { PaiementWithCommande } from '../../../../models/paiement.model';
import { CurrencyPipe } from '../../../../core/pipes/currency.pipe';

@Component({
  selector: 'app-paiement-table',
  standalone: true,
  imports: [CommonModule, TableComponent],
  providers: [CurrencyPipe],
  templateUrl: './paiement-table.html'
})
export class PaiementTableComponent {
  @Input() data: PaiementWithCommande[] = [];
  @Input() loading = false;
  @Input() actions: TableAction[] = [];
  @Input() emptyMessage = 'Aucun paiement trouvé.';
  @Input() showClient = false;

  private currencyPipe = inject(CurrencyPipe);

  get columns(): TableColumn[] {
    const base: TableColumn[] = [
      { key: 'id', label: 'ID', width: '8%' },
      { key: 'dateFormatted', label: 'Date', width: '18%' },
      { key: 'montantFormatted', label: 'Montant', width: '15%' },
      { key: 'statut', label: 'Statut', width: '12%' }
    ];
    if (this.showClient) {
      base.push({ key: 'client', label: 'Client', width: '18%' });
    }
    base.push({ key: 'commandeInfo', label: 'Commande', width: '15%' });
    return base;
  }

  get displayData(): any[] {
    return this.data.map(p => ({
      ...p,
      dateFormatted: this.formatDate(p.date),
      montantFormatted: p.montant != null ? this.currencyPipe.transform(p.montant) : '-',
      commandeInfo: p.commandeId ? `#${p.commandeId}` : '-',
      client: p.utilisateur?.username ?? '-'
    }));
  }

  private formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
