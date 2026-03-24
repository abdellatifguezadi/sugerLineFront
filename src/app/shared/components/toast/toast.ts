import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class ToastComponent implements OnInit, OnDestroy {
  private toastService = inject(ToastService);
  private sub: Subscription | null = null;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  toast: Toast | null = null;

  ngOnInit(): void {
    this.sub = this.toastService.messages$.subscribe(t => {
      this.toast = t;
      if (this.hideTimeout) clearTimeout(this.hideTimeout);
      this.hideTimeout = setTimeout(() => {
        this.toast = null;
        this.hideTimeout = null;
      }, 4000);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
  }

  close(): void {
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
    this.hideTimeout = null;
    this.toast = null;
  }
}
