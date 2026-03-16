import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header';
import { LoginFormComponent } from '../components/login-form/login-form';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, HeaderComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private store = inject(Store);
  
  loading = false;

  onLogin(credentials: any) {
    this.loading = true;
    console.log('Login credentials:', credentials);
    
    this.store.dispatch(AuthActions.login({ credentials }));
    
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
}