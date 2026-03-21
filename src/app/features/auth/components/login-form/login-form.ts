import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../../../models/auth.model';

import { LoadingComponent } from '../../../../shared/components/loading/loading';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.css']
})
export class LoginFormComponent {
  @Input() loading = false;
  @Input() error: string | null = null;
  @Output() formSubmit = new EventEmitter<LoginRequest>();
  
  private fb = new FormBuilder();
  
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    motDePasse: ['', [Validators.required]]
  });

  get usernameControl() {
    return this.loginForm.get('username') as FormControl;
  }

  get passwordControl() {
    return this.loginForm.get('motDePasse') as FormControl;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.formSubmit.emit(this.loginForm.getRawValue() as LoginRequest);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}