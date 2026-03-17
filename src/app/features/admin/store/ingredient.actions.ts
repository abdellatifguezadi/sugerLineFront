import { createAction, props } from '@ngrx/store';
import { Ingredient, IngredientRequest, IngredientUpdate } from '../../../models/ingredient.model';

export const loadIngredients = createAction('[Ingredient] Load Ingredients');

export const loadIngredientsSuccess = createAction(
  '[Ingredient] Load Ingredients Success',
  props<{ ingredients: Ingredient[] }>()
);

export const loadIngredientsFailure = createAction(
  '[Ingredient] Load Ingredients Failure',
  props<{ error: string }>()
);

export const loadIngredient = createAction(
  '[Ingredient] Load Ingredient',
  props<{ id: number }>()
);

export const loadIngredientSuccess = createAction(
  '[Ingredient] Load Ingredient Success',
  props<{ ingredient: Ingredient }>()
);

export const loadIngredientFailure = createAction(
  '[Ingredient] Load Ingredient Failure',
  props<{ error: string }>()
);

export const createIngredient = createAction(
  '[Ingredient] Create Ingredient',
  props<{ ingredient: IngredientRequest }>()
);

export const createIngredientSuccess = createAction(
  '[Ingredient] Create Ingredient Success',
  props<{ ingredient: Ingredient }>()
);

export const createIngredientFailure = createAction(
  '[Ingredient] Create Ingredient Failure',
  props<{ error: string }>()
);

export const updateIngredient = createAction(
  '[Ingredient] Update Ingredient',
  props<{ id: number; ingredient: IngredientUpdate }>()
);

export const updateIngredientSuccess = createAction(
  '[Ingredient] Update Ingredient Success',
  props<{ ingredient: Ingredient }>()
);

export const updateIngredientFailure = createAction(
  '[Ingredient] Update Ingredient Failure',
  props<{ error: string }>()
);

export const deleteIngredient = createAction(
  '[Ingredient] Delete Ingredient',
  props<{ id: number }>()
);

export const deleteIngredientSuccess = createAction(
  '[Ingredient] Delete Ingredient Success',
  props<{ id: number }>()
);

export const deleteIngredientFailure = createAction(
  '[Ingredient] Delete Ingredient Failure',
  props<{ error: string }>()
);

export const clearSelectedIngredient = createAction('[Ingredient] Clear Selected Ingredient');
