import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { IngredientService } from '../services/ingredient.service';
import { getHttpErrorMessage } from '../../../core/utils/error.utils';
import * as IngredientActions from './ingredient.actions';

@Injectable()
export class IngredientEffects {
  private actions$ = inject(Actions);
  private ingredientService = inject(IngredientService);

  loadIngredients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IngredientActions.loadIngredients),
      switchMap(() =>
        this.ingredientService.getAllIngredients().pipe(
          map(ingredients => IngredientActions.loadIngredientsSuccess({ ingredients })),
          catchError(error => of(IngredientActions.loadIngredientsFailure({ error: getHttpErrorMessage(error) })))
        )
      )
    )
  );

  loadIngredient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IngredientActions.loadIngredient),
      switchMap(({ id }) =>
        this.ingredientService.getIngredientById(id).pipe(
          map(ingredient => IngredientActions.loadIngredientSuccess({ ingredient })),
          catchError(error => of(IngredientActions.loadIngredientFailure({ error: getHttpErrorMessage(error) })))
        )
      )
    )
  );

  createIngredient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IngredientActions.createIngredient),
      switchMap(({ ingredient }) =>
        this.ingredientService.createIngredient(ingredient).pipe(
          map(createdIngredient => IngredientActions.createIngredientSuccess({ ingredient: createdIngredient })),
          catchError(error => of(IngredientActions.createIngredientFailure({ error: getHttpErrorMessage(error) })))
        )
      )
    )
  );

  updateIngredient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IngredientActions.updateIngredient),
      switchMap(({ id, ingredient }) =>
        this.ingredientService.updateIngredient(id, ingredient).pipe(
          map(updatedIngredient => IngredientActions.updateIngredientSuccess({ ingredient: updatedIngredient })),
          catchError(error => of(IngredientActions.updateIngredientFailure({ error: getHttpErrorMessage(error) })))
        )
      )
    )
  );

  deleteIngredient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IngredientActions.deleteIngredient),
      switchMap(({ id }) =>
        this.ingredientService.deleteIngredient(id).pipe(
          map(() => IngredientActions.deleteIngredientSuccess({ id })),
          catchError(error => of(IngredientActions.deleteIngredientFailure({ error: getHttpErrorMessage(error) })))
        )
      )
    )
  );
}
