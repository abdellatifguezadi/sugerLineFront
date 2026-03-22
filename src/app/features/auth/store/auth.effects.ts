import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ROOT_EFFECTS_INIT, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, catchError, switchMap, tap, filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { getHttpErrorMessage } from '../../../core/utils/error.utils';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      filter(() => typeof localStorage !== 'undefined' && !!localStorage.getItem('user')),
      switchMap(() =>
        this.authService.me().pipe(
          map(user => AuthActions.loadUserSuccess({ user })),
          catchError(error => of(AuthActions.loadUserFailure({ error: getHttpErrorMessage(error) })))
        )
      )
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map(response => AuthActions.loginSuccess({ response })),
          catchError(error => of(AuthActions.loginFailure({ error: getHttpErrorMessage(error) })))
        )
      )
    )
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUser),
      switchMap(() =>
        this.authService.me().pipe(
          map(user => AuthActions.loadUserSuccess({ user })),
          catchError(error => of(AuthActions.loadUserFailure({ error: getHttpErrorMessage(error) })))
        )
      )
    )
  );

  redirectAfterLoginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ response }) => {
          const isAdmin = (response.role ?? '').trim().toLowerCase().includes('admin');
          this.router.navigate(isAdmin ? ['/admin'] : ['/my-statistiques']);
        })
      ),
    { dispatch: false }
  );
}
