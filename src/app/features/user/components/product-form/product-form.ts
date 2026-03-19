import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { Ingredient } from '../../../../models/ingredient.model';
import { Product } from '../../../../models/product.model';
import { selectAllIngredients } from '../../../admin/store/ingredient.selectors';

type ProductFormValue = {
  nom: string;
  prixVente: number;
  ingredientProduits: { ingredientId: number; quantite: number }[];
};

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductFormComponent implements OnInit {
  @Input() product: Product | null = null;
  @Input() isEditMode = false;
  @Output() submitForm = new EventEmitter<ProductFormValue>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private store = inject(Store);

  ingredients: Ingredient[] = [];
  productForm: FormGroup = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    prixVente: [0, [Validators.required, Validators.min(0)]],
    ingredientProduits: this.fb.array([])
  });

  get ingredientProduits(): FormArray {
    return this.productForm.get('ingredientProduits') as FormArray;
  }

  ngOnInit(): void {
    this.store
      .select(selectAllIngredients)
      .pipe(take(1))
      .subscribe((ings) => {
        this.ingredients = ings ?? [];
        this.initFromProductIfNeeded();
      });

    if (!this.isEditMode) {
      this.addIngredientRow();
    }
  }

  private initFromProductIfNeeded(): void {
    if (!this.product) return;

    this.productForm.patchValue({
      nom: this.product.nom,
      prixVente: this.product.prixVente
    });

    this.ingredientProduits.clear();
    for (const ip of this.product.ingredientProduits ?? []) {
      const matched = this.ingredients.find((i) => i.nom === ip.ingredientNom);
      if (!matched) continue;
      this.ingredientProduits.push(
        this.fb.group({
          ingredientId: [matched.id, Validators.required],
          quantite: [ip.quantite, [Validators.required, Validators.min(0.0000001)]]
        })
      );
    }

    if (this.ingredientProduits.length === 0) {
      this.addIngredientRow();
    }
  }

  addIngredientRow(): void {
    this.ingredientProduits.push(
      this.fb.group({
        ingredientId: [null, Validators.required],
        quantite: [0, [Validators.required, Validators.min(0.0000001)]]
      })
    );
  }

  removeIngredientRow(index: number): void {
    if (this.ingredientProduits.length <= 1) return;
    this.ingredientProduits.removeAt(index);
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    this.submitForm.emit(this.productForm.value as ProductFormValue);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

