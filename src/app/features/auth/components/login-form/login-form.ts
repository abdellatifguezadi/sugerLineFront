import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../../shared/components/input/input';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.css']
})
export class LoginFormComponent {
  @Input() loading = false;
  @Output() formSubmit = new EventEmitter<any>();
  
  private fb = new FormBuilder();
  
  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
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
      this.formSubmit.emit(this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}