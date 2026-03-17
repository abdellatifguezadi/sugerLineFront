import { createReducer, on } from '@ngrx/store';
import { IngredientState } from '../../../models/ingredient.model';
import * as IngredientActions from './ingredient.actions';

export const initialState: IngredientState = {
  ingredients: [],
  selectedIngredient: null,
  isLoading: false,
  error: null
};

export const ingredientReducer = createReducer(
  initialState,

  on(IngredientActions.loadIngredients, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(IngredientActions.loadIngredientsSuccess, (state, { ingredients }) => ({
    ...state,
    ingredients,
    isLoading: false,
    error: null
  })),

  on(IngredientActions.loadIngredientsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(IngredientActions.loadIngredient, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(IngredientActions.loadIngredientSuccess, (state, { ingredient }) => ({
    ...state,
    selectedIngredient: ingredient,
    isLoading: false,
    error: null
  })),

  on(IngredientActions.loadIngredientFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(IngredientActions.createIngredient, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(IngredientActions.createIngredientSuccess, (state, { ingredient }) => ({
    ...state,
    ingredients: [...state.ingredients, ingredient],
    isLoading: false,
    error: null
  })),

  on(IngredientActions.createIngredientFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(IngredientActions.updateIngredient, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(IngredientActions.updateIngredientSuccess, (state, { ingredient }) => ({
    ...state,
    ingredients: state.ingredients.map(i => i.id === ingredient.id ? ingredient : i),
    selectedIngredient: state.selectedIngredient?.id === ingredient.id ? ingredient : state.selectedIngredient,
    isLoading: false,
    error: null
  })),

  on(IngredientActions.updateIngredientFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(IngredientActions.deleteIngredient, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(IngredientActions.deleteIngredientSuccess, (state, { id }) => ({
    ...state,
    ingredients: state.ingredients.filter(i => i.id !== id),
    selectedIngredient: state.selectedIngredient?.id === id ? null : state.selectedIngredient,
    isLoading: false,
    error: null
  })),

  on(IngredientActions.deleteIngredientFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(IngredientActions.clearSelectedIngredient, (state) => ({
    ...state,
    selectedIngredient: null
  }))
);
