import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  selectIsAuthenticated,
  selectRole
} from '../auth/store/auth.selectors';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './not-found.html'
})
export class NotFoundComponent {
  private store = inject(Store);

  private isAuthenticatedSignal = toSignal(this.store.select(selectIsAuthenticated), {
    initialValue: false
  });
  private roleSignal = toSignal(this.store.select(selectRole), {
    initialValue: null
  });

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSignal();
  }

  get dashboardLink(): string {
    const isAdmin = (this.roleSignal() ?? '').trim().toLowerCase().includes('admin');
    return isAdmin ? '/admin' : '/my-statistiques';
  }
}
