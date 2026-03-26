import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../features/auth/store/auth.actions';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  @Input() title = 'Dashboard';
  @Output() menuToggle = new EventEmitter<void>();
  
  private store = inject(Store);
  private router = inject(Router);

  logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/login']);
  }
}
