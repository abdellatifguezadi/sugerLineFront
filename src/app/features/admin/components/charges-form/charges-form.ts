import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ChargesMensuelles, ChargesMensuellesRequest } from '../../../../models/charges.model';
import { ChargesService } from '../../services/charges.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading';
import { getHttpErrorMessage } from '../../../../core/utils/error.utils';

@Component({
  selector: 'app-charges-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './charges-form.html',
  styleUrl: './charges-form.css'
})
export class ChargesFormComponent implements OnInit {
  @Input() charges: ChargesMensuelles | null = null;
  @Input() isEditMode = false;
  @Output() success = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private chargesService = inject(ChargesService);

  loading = false;

  currentYear = new Date().getFullYear();
  anneeOptions = Array.from({ length: 6 }, (_, i) => this.currentYear - i);

  chargesForm: FormGroup = this.fb.group({
    mois: [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]],
    annee: [this.currentYear, [Validators.required, Validators.min(2020)]],
    electricite: [0, [Validators.required, Validators.min(0)]],
    eau: [0, [Validators.required, Validators.min(0)]],
    salaires: [0, [Validators.required, Validators.min(0)]],
    loyer: [0, [Validators.required, Validators.min(0)]],
    autres: [0, [Validators.min(0)]]
  });

  ngOnInit(): void {
    if (this.charges && this.isEditMode) {
      this.chargesForm.patchValue({
        mois: this.charges.mois,
        annee: this.charges.annee,
        electricite: this.charges.electricite,
        eau: this.charges.eau,
        salaires: this.charges.salaires,
        loyer: this.charges.loyer,
        autres: this.charges.autres ?? 0
      });
    }
  }

  onSubmit(): void {
    if (this.chargesForm.invalid) {
      this.chargesForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const value = this.chargesForm.value;

    if (this.isEditMode && this.charges) {
      this.chargesService.update(this.charges.id, {
        electricite: value.electricite,
        eau: value.eau,
        salaires: value.salaires,
        loyer: value.loyer,
        autres: value.autres
      }).subscribe({
        next: () => {
          this.loading = false;
          this.success.emit('Charges mises à jour avec succès.');
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.error.emit(getHttpErrorMessage(err));
        }
      });
    } else {
      this.chargesService.create(value as ChargesMensuellesRequest).subscribe({
        next: () => {
          this.loading = false;
          this.success.emit('Charges créées avec succès.');
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.error.emit(getHttpErrorMessage(err));
        }
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getError(controlName: string): string {
    const control = this.chargesForm.get(controlName);

    if (!control || !control.touched || control.valid) {
      return '';
    }

    if (control.errors?.['required']) {
      return 'Ce champ est obligatoire';
    }

    if (control.errors?.['min']) {
      return `Minimum ${control.errors['min'].min}`;
    }

    if (control.errors?.['max']) {
      return `Maximum ${control.errors['max'].max}`;
    }

    return 'Champ invalide';
  }
}
