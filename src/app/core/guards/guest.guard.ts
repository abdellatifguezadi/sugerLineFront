import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isAuthenticated = typeof localStorage !== 'undefined' && !!localStorage.getItem('user');

  if (!isAuthenticated) {
    return true;
  }

  return router.createUrlTree(['/admin']);
};
