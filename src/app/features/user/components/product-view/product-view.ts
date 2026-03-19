import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '../../../../core/pipes/currency.pipe';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [CommonModule],
  providers: [CurrencyPipe],
  templateUrl: './product-view.html',
  styleUrl: './product-view.css'
})
export class ProductViewComponent {
  @Input() product: Product | null = null;
  @Output() close = new EventEmitter<void>();

  constructor(public currencyPipe: CurrencyPipe) {}

  onClose(): void {
    this.close.emit();
  }
}

