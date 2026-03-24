import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { take, filter } from 'rxjs/operators';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { LoginFormComponent } from '../../components/login-form/login-form';
import * as AuthActions from '../../store/auth.actions';
import { LoginRequest } from '../../../../models/auth.model';
import { selectAuthError } from '../../store/auth.selectors';
import { ToastService } from '../../../../core/services/toast.service';

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
  private toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  loading = false;

  constructor() {
    this.store
      .select(selectAuthError)
      .pipe(
        filter((e): e is string => e != null),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((msg) => this.toast.showError(msg));
  }

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