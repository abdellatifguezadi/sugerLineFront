import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login';
import { HomeComponent } from './features/home/home';
import { AdminDashboardComponent } from './features/admin/pages/admin-dashboard/admin-dashboard';
import { IngredientsComponent } from './features/admin/pages/ingredients/ingredients';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard] },
  { path: 'ingredients', component: IngredientsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
