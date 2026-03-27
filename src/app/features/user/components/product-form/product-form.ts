import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { Ingredient } from '../../../../models/ingredient.model';
import { Product, ProductRequest, ProductUpdate } from '../../../../models/product.model';
import { selectAllIngredients } from '../../../admin/store/ingredient.selectors';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../../../core/services/toast.service';
import { getHttpErrorMessage } from '../../../../core/utils/error.utils';

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
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private productService = inject(ProductService);
  private toast = inject(ToastService);

  ingredients: Ingredient[] = [];
  productForm: FormGroup = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    prixVente: [1, [Validators.required, Validators.min(1)]],
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

    const raw = this.productForm.value;
    const ingredientProduits = (raw.ingredientProduits as { ingredientId: number; quantite: number }[]).map(ip => ({
      ingredientId: Number(ip.ingredientId),
      quantite: Number(ip.quantite)
    }));

    const payload = {
      nom: raw.nom,
      prixVente: Number(raw.prixVente),
      ingredientProduits
    };

    const obs = this.isEditMode && this.product
      ? this.productService.updateProduct(this.product.id, payload as ProductUpdate)
      : this.productService.createProduct(payload as ProductRequest);

    obs.subscribe({
      next: () => {
        this.toast.showSuccess(this.isEditMode ? 'Produit mis à jour.' : 'Produit créé.');
        this.saved.emit();
      },
      error: (err) => this.toast.showError(getHttpErrorMessage(err))
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getError(controlName: string): string {
    const control = this.productForm.get(controlName);

    if (!control || !control.touched || control.valid) {
      return '';
    }

    if (control.errors?.['required']) {
      return 'Ce champ est obligatoire';
    }

    if (control.errors?.['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} caracters`;
    }

    if (control.errors?.['maxlength']) {
      return `Maximum ${control.errors['maxlength'].requiredLength} caracters`;
    }

    if (control.errors?.['min']) {
      return 'La valeur doit etre positive';
    }


    return 'Champ invalide';
  }
}

