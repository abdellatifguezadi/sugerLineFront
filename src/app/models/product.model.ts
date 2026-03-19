export interface IngredientProduit {
  id: number;
  quantite: number;
  ingredientNom: string;
}

export interface Product {
  id: number;
  nom: string;
  prixProduction: number;
  prixVente: number;
  ingredientProduits: IngredientProduit[];
}

export interface IngredientProduitRequest {
  quantite: number;
  ingredientId: number;
}

export interface ProductRequest {
  nom: string;
  prixVente: number;
  ingredientProduits: IngredientProduitRequest[];
}

export interface ProductUpdate {
  nom?: string;
  prixVente?: number;
  ingredientProduits?: IngredientProduitRequest[];
}


