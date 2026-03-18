import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css'
})
export class PaginationComponent {
  @Input() currentPage = 0; 
  @Input() totalPages = 0;

  @Output() pageChange = new EventEmitter<number>();

  get show(): boolean {
    return (this.totalPages ?? 0) > 1;
  }

  get pages(): number[] {
    const total = Math.max(0, Number(this.totalPages) || 0);
    return Array.from({ length: total }, (_, i) => i);
  }

  previous(): void {
    if (this.currentPage <= 0) return;
    this.pageChange.emit(this.currentPage - 1);
  }

  next(): void {
    if (this.currentPage >= this.totalPages - 1) return;
    this.pageChange.emit(this.currentPage + 1);
  }

  goTo(page: number): void {
    if (!Number.isFinite(page)) return;
    if (page < 0 || page >= this.totalPages) return;
    if (page === this.currentPage) return;
    this.pageChange.emit(page);
  }
}

