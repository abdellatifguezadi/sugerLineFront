import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectRole
} from '../../features/auth/store/auth.selectors';

export const adminGuard: CanActivateFn = () => {
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
        return router.createUrlTree(['/login']);
      }
      const isAdmin = (role ?? '').trim().toLowerCase() === 'administrateur';
      console.log(isAdmin);
      console.log(role);
      console.log(isAuthenticated);
      if (!isAdmin) {
        return router.createUrlTree(['/My-statistiques']);
      }
      return true;
    })
  );
};
