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
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  private store = inject(Store);

  private isAuthenticated = toSignal(this.store.select(selectIsAuthenticated), {
    initialValue: false
  });
  private role = toSignal(this.store.select(selectRole), {
    initialValue: null
  });

  get dashboardLink(): string {
    if (!this.isAuthenticated()) {
      return '/login';
    }
    const isAdmin = (this.role() ?? '').trim().toLowerCase().includes('admin');
    return isAdmin ? '/admin' : '/my-statistiques';
  }

  get loginLabel(): string {
    return this.isAuthenticated() ? 'Dashboard' : 'Login';
  }

  get getStartedLabel(): string {
    return this.isAuthenticated() ? 'Go to Dashboard' : 'Get Started';
  }

  get heroCtaLabel(): string {
    return this.isAuthenticated() ? 'Go to Dashboard' : 'Get Started Free';
  }
}
