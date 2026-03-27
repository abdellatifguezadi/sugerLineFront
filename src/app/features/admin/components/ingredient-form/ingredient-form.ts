import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Ingredient, IngredientRequest, IngredientUpdate } from '../../../../models/ingredient.model';
import * as IngredientActions from '../../store/ingredient.actions';

@Component({
  selector: 'app-ingredient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ingredient-form.html',
  styleUrl: './ingredient-form.css'
})
export class IngredientFormComponent implements OnInit {
  @Input() ingredient: Ingredient | null = null;
  @Input() isEditMode = false;
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private store = inject(Store);

  ingredientForm: FormGroup = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    unite: ['', Validators.required],
    prixUnitaire: [0, [Validators.required, Validators.min(0)]],
    type: ['', Validators.required]
  });

  ngOnInit(): void {
    if (this.ingredient) {
      this.ingredientForm.patchValue(this.ingredient);
    }
  }

  onSubmit(): void {
    if (this.ingredientForm.invalid) {
      this.ingredientForm.markAllAsTouched();
      return;
    }

    const payload = this.ingredientForm.value as IngredientRequest;

    if (this.isEditMode && this.ingredient) {
      this.store.dispatch(
        IngredientActions.updateIngredient({
          id: this.ingredient.id,
          ingredient: payload as IngredientUpdate
        })
      );
    } else {
      this.store.dispatch(
        IngredientActions.createIngredient({
          ingredient: payload
        })
      );
    }

    this.saved.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getError(controlName: string): string {
    const control = this.ingredientForm.get(controlName);

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
