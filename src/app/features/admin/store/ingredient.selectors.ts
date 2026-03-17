import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IngredientState } from '../../../models/ingredient.model';

export const selectIngredientState = createFeatureSelector<IngredientState>('ingredient');

export const selectAllIngredients = createSelector(
  selectIngredientState,
  (state) => state.ingredients
);

export const selectSelectedIngredient = createSelector(
  selectIngredientState,
  (state) => state.selectedIngredient
);

export const selectIngredientLoading = createSelector(
  selectIngredientState,
  (state) => state.isLoading
);

export const selectIngredientError = createSelector(
  selectIngredientState,
  (state) => state.error
);

export const selectIngredientById = (id: number) => createSelector(
  selectAllIngredients,
  (ingredients) => ingredients.find(ingredient => ingredient.id === id)
);

export const selectIngredientsByType = (type: string) => createSelector(
  selectAllIngredients,
  (ingredients) => ingredients.filter(ingredient => ingredient.type === type)
);
