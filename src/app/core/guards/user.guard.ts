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

function isAdminRole(role: string | null): boolean {
  return (role ?? '').trim().toUpperCase() === 'ADMINISTRATEUR';
}

export const userGuard: CanActivateFn = () => {
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
      if (!isAuthenticated) return router.createUrlTree(['/login']);
      if (isAdminRole(role)) return router.createUrlTree(['/']);
      return true;
    })
  );
};
