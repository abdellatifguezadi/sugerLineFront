import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as IngredientActions from '../../store/ingredient.actions';
import { selectAllIngredients, selectIngredientLoading, selectIngredientError } from '../../store/ingredient.selectors';
import { selectIsLoading, selectRole } from '../../../auth/store/auth.selectors';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { TableComponent, TableColumn, TableAction } from '../../../../shared/components/table/table';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { IngredientFormComponent } from '../../components/ingredient-form/ingredient-form';
import { CurrencyPipe } from '../../../../core/pipes/currency.pipe';
import { Ingredient } from '../../../../models/ingredient.model';
import { map, filter } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarComponent, TableComponent, ConfirmDialogComponent, IngredientFormComponent],
  providers: [CurrencyPipe],
  templateUrl: './ingredients.html',
  styleUrl: './ingredients.css'
})
export class IngredientsComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private currencyPipe = inject(CurrencyPipe);
  private toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  sidebarOpen = false;

  private originalIngredients: Ingredient[] = [];

  ingredients$ = this.store.select(selectAllIngredients).pipe(
    map(ingredients => {
      this.originalIngredients = ingredients;
      return ingredients.map(ing => ({
        ...ing,
        prixUnitaire: this.currencyPipe.transform(ing.prixUnitaire)
      }));
    })
  );
  loading$ = this.store.select(selectIngredientLoading);
  connectedRole$ = this.store.select(selectRole);
  authLoading$ = this.store.select(selectIsLoading);

  showModal = false;
  isEditMode = false;
  selectedIngredient: Ingredient | null = null;
  showDeleteConfirm = false;
  ingredientToDeleteId: number | null = null;

  tableColumns: TableColumn[] = [
    { key: 'type', label: 'Type', width: '20%' },
    { key: 'nom', label: 'Nom', width: '35%' },
    { key: 'unite', label: 'Unité', width: '15%' },
    { key: 'prixUnitaire', label: 'Prix Unitaire', width: '20%' }
  ];

  tableActions: TableAction[] = [
    {
      label: 'Modifier',
      icon: 'edit',
      class: 'rounded-lg border border-primary/20 p-2 text-primary transition-colors hover:bg-primary/10',
      callback: (item: Ingredient) => this.openEditModal(item)
    },
    {
      label: 'Supprimer',
      icon: 'delete',
      class: 'rounded-lg border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50',
      callback: (item: Ingredient) => this.openDeleteConfirm(item.id)
    }
  ];

  ngOnInit(): void {
    this.store.dispatch(IngredientActions.loadIngredients());
    this.store
      .select(selectIngredientError)
      .pipe(filter((e): e is string => e != null), takeUntilDestroyed(this.destroyRef))
      .subscribe((msg) => this.toast.showError(msg));
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedIngredient = null;
    this.showModal = true;
  }

  openEditModal(ingredient: Ingredient): void {
    this.isEditMode = true;
    const originalIngredient = this.originalIngredients.find(ing => ing.id === ingredient.id);
    this.selectedIngredient = originalIngredient || null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedIngredient = null;
    this.isEditMode = false;
  }

  onSubmit(formData: any): void {
    if (this.isEditMode && this.selectedIngredient) {
      this.store.dispatch(
        IngredientActions.updateIngredient({
          id: this.selectedIngredient.id,
          ingredient: formData
        })
      );
    } else {
      this.store.dispatch(
        IngredientActions.createIngredient({
          ingredient: formData
        })
      );
    }
    this.closeModal();
  }

  openDeleteConfirm(id: number): void {
    this.ingredientToDeleteId = id;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.ingredientToDeleteId = null;
  }

  confirmDelete(): void {
    const id = this.ingredientToDeleteId;
    if (id == null) return;
    this.closeDeleteConfirm();
    this.store.dispatch(IngredientActions.deleteIngredient({ id }));
  }
}
