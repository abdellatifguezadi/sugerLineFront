import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommandeResponse } from '../../../../models/commande.model';
import { ProductService } from '../../services/product.service';
import { CommandeService } from '../../services/commande.service';
import { Product } from '../../../../models/product.model';
import { getHttpErrorMessage } from '../../../../core/utils/error.utils';
import { LoadingComponent } from '../../../../shared/components/loading/loading';

@Component({
  selector: 'app-commande-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './commande-form.html',
  styleUrl: './commande-form.css'
})
export class CommandeFormComponent implements OnInit {
  @Input() commande: CommandeResponse | null = null;
  @Input() isEditMode = false;
  @Output() saved = new EventEmitter<void>();
  @Output() error = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private commandeService = inject(CommandeService);

  submitting = false;
  formError: string | null = null;

  products: Product[] = [];
  loadingProducts = true;

  commandeForm: FormGroup = this.fb.group({
    date: ['', Validators.required],
    commandeLines: this.fb.array([], Validators.required)
  });

  get commandeLines(): FormArray {
    return this.commandeForm.get('commandeLines') as FormArray;
  }

  ngOnInit(): void {
    this.productService.getAllProducts({ page: 0, size: 500 }).subscribe({
      next: res => {
        this.products = res.content;
        this.loadingProducts = false;
        this.initFromCommandeIfNeeded();
      },
      error: () => {
        this.loadingProducts = false;
      }
    });
  }

  private initFromCommandeIfNeeded(): void {
    if (!this.commande || !this.isEditMode) {
      if (this.commandeLines.length === 0) this.addLine();
      return;
    }
    this.commandeForm.patchValue({
      date: this.commande.date 
    });
    this.commandeLines.clear();
    for (const line of this.commande.commandeLines ?? []) {
      const product = this.products.find(p => p.nom === line.produit);
      if (!product) continue;
      this.commandeLines.push(
        this.fb.group({
          produitId: [product.id, Validators.required],
          quantite: [line.quantite, [Validators.required, Validators.min(1)]]
        })
      );
    }
    if (this.commandeLines.length === 0) this.addLine();
  }

  addLine(): void {
    this.commandeLines.push(
      this.fb.group({
        produitId: [null, Validators.required],
        quantite: [1, [Validators.required, Validators.min(1)]]
      })
    );
  }

  removeLine(index: number): void {
    if (this.commandeLines.length <= 1) return;
    this.commandeLines.removeAt(index);
  }

  onSubmit(): void {
    if (this.commandeForm.invalid) {
      this.commandeForm.markAllAsTouched();
      return;
    }
    const raw = this.commandeForm.value;
    const lines = (raw.commandeLines as { produitId: number; quantite: number }[]).map(l => ({
      produitId: Number(l.produitId),
      quantite: Number(l.quantite)
    }));

    const payload = { date: raw.date, commandeLines: lines };
    this.submitting = true;
    this.formError = null;

    const obs = this.isEditMode && this.commande
      ? this.commandeService.updateCommande(this.commande.id, payload)
      : this.commandeService.createCommande(payload);

    obs.subscribe({
      next: () => {
        this.submitting = false;
        this.saved.emit();
      },
      error: err => {
        this.submitting = false;
        const msg = getHttpErrorMessage(err);
        this.formError = msg;
        this.error.emit(msg);
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
