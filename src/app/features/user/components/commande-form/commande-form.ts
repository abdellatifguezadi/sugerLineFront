import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommandeResponse } from '../../../../models/commande.model';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../../models/product.model';

type CommandeFormValue = {
  date: string;
  commandeLines: { produitId: number; quantite: number }[];
};

@Component({
  selector: 'app-commande-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './commande-form.html',
  styleUrl: './commande-form.css'
})
export class CommandeFormComponent implements OnInit {
  @Input() commande: CommandeResponse | null = null;
  @Input() isEditMode = false;
  @Output() submitForm = new EventEmitter<CommandeFormValue>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);

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
    const lines = (raw.commandeLines as { produitId: number; quantite: number }[])
      .filter(l => l?.produitId != null && l?.quantite != null && l.quantite >= 1)
      .map(l => ({ produitId: Number(l.produitId), quantite: Number(l.quantite) }));
    if (lines.length === 0) return;
    this.submitForm.emit({
      date: raw.date,
      commandeLines: lines
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
