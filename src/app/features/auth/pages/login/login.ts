import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs/operators';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { LoginFormComponent } from '../../components/login-form/login-form';
import * as AuthActions from '../../store/auth.actions';
import { LoginRequest } from '../../../../models/auth.model';
import { selectAuthError } from '../../store/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, LoginFormComponent, HeaderComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private store = inject(Store);
  private actions$ = inject(Actions);

  loading = false;
  error$ = this.store.select(selectAuthError);

  onLogin(credentials: LoginRequest) {
    this.loading = true;

    this.store.dispatch(AuthActions.login({ credentials }));

    this.actions$
      .pipe(ofType(AuthActions.loginSuccess, AuthActions.loginFailure), take(1))
      .subscribe((action) => {
        if (action.type === AuthActions.loginFailure.type) {
          this.loading = false;
        }
      });
  }
}