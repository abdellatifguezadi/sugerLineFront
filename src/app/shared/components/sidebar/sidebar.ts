import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoadingComponent } from '../loading/loading';

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

  get isAdmin(): boolean {
    return (this.role ?? '').trim().toLowerCase().includes('admin');
  }

  get menuItems(): SidebarItem[] {
    if (this.isAdmin) {
      return [
        { label: 'Dashboard', icon: 'dashboard', route: '/admin' },
        { label: 'Charges Mensuel', icon: 'payments' },
        { label: 'Rapport Mensuel', icon: 'description' },
        { label: 'Gestion de Users', icon: 'manage_accounts', route: '/users-management' },
        { label: 'All Product', icon: 'cake', route: '/products' },
        { label: 'Ingredient', icon: 'inventory_2', route: '/ingredients' },
        { label: 'All Commande', icon: 'shopping_bag', route: '/commandes' },
        { label: 'All Payments', icon: 'receipt_long', route: '/all-payments' },
      ];
    }

    return [
      { label: 'Dashboard', icon: 'dashboard', active: true },
      { label: 'My Payment', icon: 'payments', route: '/my-payments' },
      { label: 'My Commande', icon: 'shopping_bag', route: '/my-commandes' },
      { label: 'All Product', icon: 'cake', route: '/products' },
      { label: 'My Statistique', icon: 'analytics' },
    ];
  }

  readonly skeletonItems = Array(5);
}
