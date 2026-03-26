import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectRole
} from '../../features/auth/store/auth.selectors';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const store = inject(Store);

  return combineLatest([
    store.select(selectIsAuthenticated),
    store.select(selectRole),
    store.select(selectIsLoading)
  ]).pipe(
    filter(([, , isLoading]) => !isLoading),
    take(1),
    map(([isAuthenticated, role]) => {
      if (!isAuthenticated) {
        return true;
      }
      const isAdmin = (role ?? '').trim().toUpperCase() === 'ADMINISTRATEUR';
      return router.createUrlTree([isAdmin ? '/admin' : '/my-statistiques']);
    })
  );
};
