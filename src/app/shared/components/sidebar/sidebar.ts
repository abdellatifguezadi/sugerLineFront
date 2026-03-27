import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { LoadingComponent } from '../loading/loading';
import { selectUser } from '../../../features/auth/store/auth.selectors';

type SidebarItem = {
  label: string;
  icon: string;
  route?: string;
  active?: boolean;
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LoadingComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  @Input() role: string | null = null;
  @Input() isLoading = true;
  @Input() mobileOpen = false;
  @Output() mobileOpenChange = new EventEmitter<boolean>();
  private store = inject(Store);

  user$ = this.store.select(selectUser);
  userName$ = this.user$.pipe(map((u) => u?.fullName ?? u?.username ?? null));
  userRole$ = this.user$.pipe(map((u) => u?.role ?? this.role ?? null));

  closeMobile(): void {
    this.mobileOpenChange.emit(false);
  }

  get isAdmin(): boolean {
    return (this.role ?? '').trim().toLowerCase().includes('admin');
  }

  get menuItems(): SidebarItem[] {
    if (this.isAdmin) {
      return [
        { label: 'Dashboard', icon: 'dashboard', route: '/admin' },
        { label: 'Charges Mensuel', icon: 'payments', route: '/charges' },
        { label: 'Rapport Mensuel', icon: 'description', route: '/rapports' },
        { label: 'Gestion de Users', icon: 'manage_accounts', route: '/users-management' },
        { label: 'All Product', icon: 'cake', route: '/products' },
        { label: 'Ingredient', icon: 'inventory_2', route: '/ingredients' },
        { label: 'All Commande', icon: 'shopping_bag', route: '/commandes' },
        { label: 'All Payments', icon: 'receipt_long', route: '/all-payments' },
      ];
    }

    return [
      { label: 'Dashboard', icon: 'dashboard', route: '/my-statistiques'},
      { label: 'My Payment', icon: 'payments', route: '/my-payments' },
      { label: 'My Commande', icon: 'shopping_bag', route: '/my-commandes' },
      { label: 'All Product', icon: 'cake', route: '/products' }
    ];
  }

  readonly skeletonItems = Array(5);
}
