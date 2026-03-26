import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ingredient } from '../../../../models/ingredient.model';

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
  @Output() submitForm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);

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
    if (this.ingredientForm.valid) {
      this.submitForm.emit(this.ingredientForm.value);
    }
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
