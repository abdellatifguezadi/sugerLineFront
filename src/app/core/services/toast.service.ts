import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error';

export interface Toast {
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts$ = new Subject<Toast>();
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly messages$ = this.toasts$.asObservable();

  showSuccess(message: string): void {
    this.show(message, 'success');
  }

  showError(message: string): void {
    this.show(message, 'error');
  }

  private show(message: string, type: ToastType): void {
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
    this.toasts$.next({ message, type });
  }
}
