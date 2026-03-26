import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterRequest, Role } from '../../../../models/auth.model';
import { LoadingComponent } from '../../../../shared/components/loading/loading';
import { AuthService } from '../../../auth/services/auth.service';
import { getHttpErrorMessage } from '../../../../core/utils/error.utils';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserFormComponent {
  @Output() success = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loading = false;

  roles: { value: Role; label: string }[] = [
    { value: 'ADMINISTRATEUR', label: 'Administrateur' },
    { value: 'CAISSIER', label: 'Caissier' },
    { value: 'LIVREUR', label: 'Livreur' },
    { value: 'MAGASIN', label: 'Magasin' }
  ];

  userForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required, Validators.minLength(4)]],
    fullName: ['', [Validators.required]],
    role: ['CAISSIER' as Role, [Validators.required]]
  });

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const request = this.userForm.value as RegisterRequest;

    this.authService.createUser(request).subscribe({
      next: (user) => {
        this.loading = false;
        this.success.emit(`Utilisateur "${user.username}" créé avec succès.`);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error.emit(getHttpErrorMessage(err));
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getError(controlName: string): string {
    const control = this.userForm.get(controlName);

    if (!control || !control.touched || control.valid) {
      return '';
    }

    if (control.errors?.['required']) {
      return 'Ce champ est obligatoire';
    }

    if (control.errors?.['email']) {
      return 'Email non valide';
    }

    if (control.errors?.['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} caracters`;
    }

    return 'Champ invalide';
  }
}
