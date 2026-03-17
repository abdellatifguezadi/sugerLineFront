export interface IngredientRequest {
  nom: string;
  unite: string;
  prixUnitaire: number;
  type: string;
}

export interface IngredientUpdate {
  nom?: string;
  unite?: string;
  prixUnitaire?: number;
  type?: string;
}

export interface Ingredient {
  id: number;
  type: string;
  nom: string;
  unite: string;
  prixUnitaire: number;
}

export interface IngredientState {
  ingredients: Ingredient[];
  selectedIngredient: Ingredient | null;
  isLoading: boolean;
  error: string | null;
}
