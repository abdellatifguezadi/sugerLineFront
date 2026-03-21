import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login';
import { HomeComponent } from './features/home/home';
import { AdminDashboardComponent } from './features/admin/pages/admin-dashboard/admin-dashboard';
import { IngredientsComponent } from './features/admin/pages/ingredients/ingredients';
import { CommandesComponent } from './features/admin/pages/commandes/commandes';
import { ProductsComponent } from './features/user/pages/product/products';
import { MyCommandesComponent } from './features/user/pages/my-commandes/my-commandes';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { userGuard } from './core/guards/user.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'ingredients', component: IngredientsComponent, canActivate: [adminGuard] },
  { path: 'commandes', component: CommandesComponent, canActivate: [adminGuard] },
  { path: 'my-commandes', component: MyCommandesComponent, canActivate: [userGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
