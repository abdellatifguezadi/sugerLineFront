import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login';
import { HomeComponent } from './features/home/home';
import { AdminDashboardComponent } from './features/admin/pages/admin-dashboard/admin-dashboard';
import { IngredientsComponent } from './features/admin/pages/ingredients/ingredients';
import { ProductsComponent } from './features/user/pages/product/products';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'ingredients', component: IngredientsComponent, canActivate: [adminGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
