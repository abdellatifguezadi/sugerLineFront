import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { userGuard } from './core/guards/user.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/pages/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboardComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'ingredients',
    loadComponent: () =>
      import('./features/admin/pages/ingredients/ingredients').then((m) => m.IngredientsComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'commandes',
    loadComponent: () =>
      import('./features/admin/pages/commandes/commandes').then((m) => m.CommandesComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'my-commandes',
    loadComponent: () =>
      import('./features/user/pages/my-commandes/my-commandes').then((m) => m.MyCommandesComponent),
    canActivate: [userGuard]
  },
  {
    path: 'my-payments',
    loadComponent: () =>
      import('./features/user/pages/my-payments/my-payments').then((m) => m.MyPaymentsComponent),
    canActivate: [userGuard]
  },
  {
    path: 'all-payments',
    loadComponent: () =>
      import('./features/admin/pages/all-payments/all-payments').then((m) => m.AllPaymentsComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'users-management',
    loadComponent: () =>
      import('./features/admin/pages/users-management/users-management').then((m) => m.UsersManagementComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'charges',
    loadComponent: () => import('./features/admin/pages/charges/charges').then((m) => m.ChargesComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'rapports',
    loadComponent: () => import('./features/admin/pages/rapports/rapports').then((m) => m.RapportsComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'products',
    loadComponent: () => import('./features/user/pages/product/products').then((m) => m.ProductsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-statistiques',
    loadComponent: () =>
      import('./features/user/pages/my-statistiques/my-statistiques').then((m) => m.MyStatistiquesComponent),
    canActivate: [userGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFoundComponent)
  }
];
