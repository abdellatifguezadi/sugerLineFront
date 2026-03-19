import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, take, tap } from 'rxjs/operators';
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
  ]).pipe(
    take(1),
    map(([isAuthenticated, role]) => {
      if (!isAuthenticated) {
        return router.createUrlTree(['/login']);
      }
      const isAdmin = (role ?? '').trim().toLowerCase() === 'administrateur';
      if (!isAdmin) {
        return router.createUrlTree(['/']);
      }
      return true;
    })
  );
};
