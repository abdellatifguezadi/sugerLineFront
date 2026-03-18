import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  placeholder?: string;
  options?: { value: any; label: string }[];
  min?: number;
  max?: number;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css'
})
export class FilterBarComponent {
  @Input() fields: FilterField[] = [];
  @Input() filters: any = {};
  
  @Output() filtersChange = new EventEmitter<any>();
  @Output() apply = new EventEmitter<any>();
  @Output() clear = new EventEmitter<void>();

  onFilterChange(): void {
    this.filtersChange.emit(this.filters);
  }

  onApply(): void {
    this.apply.emit(this.filters);
  }

  onClear(): void {
    this.filters = {};
    this.filtersChange.emit(this.filters);
    this.clear.emit();
  }

  onKeyEnter(): void {
    this.onApply();
  }
}
