import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '../../../../core/pipes/currency.pipe';
import { CommandeResponse } from '../../../../models/commande.model';

@Component({
  selector: 'app-commande-detail',
  standalone: true,
  imports: [CommonModule],
  providers: [CurrencyPipe],
  templateUrl: './commande-detail.html',
  styleUrl: './commande-detail.css'
})
export class CommandeDetailComponent {
  @Input() commande: CommandeResponse | null = null;
  @Output() close = new EventEmitter<void>();

  constructor(public currencyPipe: CurrencyPipe) {}

  onClose(): void {
    this.close.emit();
  }
}
