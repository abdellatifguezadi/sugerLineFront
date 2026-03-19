import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { selectIsAuthenticated, selectRole } from '../../features/auth/store/auth.selectors';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const store = inject(Store);

  return combineLatest([
    store.select(selectIsAuthenticated),
    store.select(selectRole)
  ]).pipe(
    take(1),
    map(([isAuthenticated, role]) => {
      if (!isAuthenticated) {
        return router.createUrlTree(['/login']);
      }
      const isAdmin = (role ?? '').trim() === 'Administrateur';
      if (!isAdmin) {
        return router.createUrlTree(['/']);
      }
      return true;
    })
  );
};
