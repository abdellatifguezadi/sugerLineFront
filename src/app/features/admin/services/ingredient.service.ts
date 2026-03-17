import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingredient, IngredientRequest, IngredientUpdate } from '../../../models/ingredient.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/ingredients`;

  getAllIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.apiUrl);
  }

  getIngredientById(id: number): Observable<Ingredient> {
    return this.http.get<Ingredient>(`${this.apiUrl}/${id}`);
  }

  createIngredient(ingredient: IngredientRequest): Observable<Ingredient> {
    return this.http.post<Ingredient>(this.apiUrl, ingredient);
  }

  updateIngredient(id: number, ingredient: IngredientUpdate): Observable<Ingredient> {
    return this.http.put<Ingredient>(`${this.apiUrl}/${id}`, ingredient);
  }

  deleteIngredient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
