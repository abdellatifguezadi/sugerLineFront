import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

type SidebarItem = {
  label: string;
  icon: string;
  route?: string;
  active?: boolean;
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
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
        { label: 'Gestion de Users', icon: 'manage_accounts' },
        { label: 'All Product', icon: 'cake', route: '/products' },
        { label: 'Ingredient', icon: 'inventory_2', route: '/ingredients' },
        { label: 'All Commande', icon: 'shopping_bag' },
        { label: 'All Payments', icon: 'receipt_long' },
      ];
    }

    return [
      { label: 'Dashboard', icon: 'dashboard', active: true },
      { label: 'My Payment', icon: 'payments' },
      { label: 'My Commande', icon: 'shopping_bag' },
      { label: 'All Product', icon: 'cake', route: '/products' },
      { label: 'My Statistique', icon: 'analytics' },
    ];
  }

  readonly skeletonItems = Array(5);
}
