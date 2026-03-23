import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RapportService } from '../../services/rapport.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading';
import { getHttpErrorMessage } from '../../../../core/utils/error.utils';

@Component({
  selector: 'app-rapport-generer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './rapport-generer-form.html',
  styleUrl: './rapport-generer-form.css'
})
export class RapportGenererFormComponent {
  @Output() success = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private rapportService = inject(RapportService);

  loading = false;

  currentYear = new Date().getFullYear();
  anneeOptions = Array.from({ length: 6 }, (_, i) => this.currentYear - i);

  form: FormGroup = this.fb.group({
    mois: [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]],
    annee: [this.currentYear, [Validators.required, Validators.min(2020)]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { mois, annee } = this.form.value;

    this.rapportService.generer(mois, annee).subscribe({
      next: () => {
        this.loading = false;
        this.success.emit('Rapport généré avec succès.');
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error.emit(getHttpErrorMessage(err));
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
