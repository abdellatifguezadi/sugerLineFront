import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaiementService } from '../../services/paiement.service';
import { getHttpErrorMessage } from '../../../../core/utils/error.utils';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-paiement-confirm',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
  templateUrl: './paiement-confirm.html'
})
export class PaiementConfirmComponent {
  @Input() visible = false;
  @Input() commandeId: number | null = null;
  @Input() montant = 0;
  @Output() cancelled = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  @Output() error = new EventEmitter<string>();

  private paiementService = inject(PaiementService);
  submitting = false;

  get message(): string {
    const m = Number(this.montant).toFixed(2);
    return `Confirmer le paiement de ${m} MAD pour la commande #${this.commandeId ?? ''} ?`;
  }

  onConfirm(): void {
    if (this.commandeId == null) return;
    this.submitting = true;
    this.paiementService.createPaiement(this.commandeId, this.montant).subscribe({
      next: () => {
        this.submitting = false;
        this.saved.emit();
      },
      error: err => {
        this.submitting = false;
        this.error.emit(getHttpErrorMessage(err));
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
