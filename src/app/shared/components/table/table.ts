import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
}

export interface TableAction {
  label: string;
  icon?: string;
  class?: string;
  callback: (item: any) => void;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'Aucune donnée disponible';
  
  @Output() rowClick = new EventEmitter<any>();
}
