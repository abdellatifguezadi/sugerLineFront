import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { TableComponent, TableColumn, TableAction } from '../../../../shared/components/table/table';
import { FilterBarComponent, FilterField } from '../../../../shared/components/filter-bar/filter-bar';
import { ProductService, PageResponse, ProductFilters } from '../../services/product.service';
import { CurrencyPipe } from '../../../../core/pipes/currency.pipe';
import { Product } from '../../../../models/product.model';
import { selectIsLoading, selectRole } from '../../../auth/store/auth.selectors';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarComponent, TableComponent, FilterBarComponent],
  providers: [CurrencyPipe],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private store = inject(Store);
  private currencyPipe = inject(CurrencyPipe);

  connectedRole$ = this.store.select(selectRole);
  authLoading$ = this.store.select(selectIsLoading);

  products: Product[] = [];
  displayProducts: any[] = [];
  loading = false;
  error: string | null = null;

  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  filters: any = {};
  filterFields: FilterField[] = [
    { key: 'nom', label: 'Nom du produit', type: 'text', placeholder: 'Rechercher...' },
    { key: 'minPrice', label: 'Prix min (MAD)', type: 'number', placeholder: '0.00', min: 0 },
    { key: 'maxPrice', label: 'Prix max (MAD)', type: 'number', placeholder: '100.00', min: 0 }
  ];

  tableColumns: TableColumn[] = [
    { key: 'nom', label: 'Nom', width: '25%' },
    { key: 'prixProduction', label: 'Prix Production', width: '20%' },
    { key: 'prixVente', label: 'Prix Vente', width: '20%' },
    { key: 'ingredientsCount', label: 'Ingrédients', width: '15%' }
  ];

  tableActions: TableAction[] = [
    {
      label: 'Voir',
      icon: 'visibility',
      class: 'rounded-lg border border-blue-200 p-2 text-blue-600 transition-colors hover:bg-blue-50',
      callback: (item: Product) => this.viewProduct(item)
    },
    {
      label: 'Modifier',
      icon: 'edit',
      class: 'rounded-lg border border-primary/20 p-2 text-primary transition-colors hover:bg-primary/10',
      callback: (item: Product) => this.editProduct(item)
    },
    {
      label: 'Supprimer',
      icon: 'delete',
      class: 'rounded-lg border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50',
      callback: (item: Product) => this.deleteProduct(item.id)
    }
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    const productFilters: ProductFilters = {
      page: this.currentPage,
      size: this.pageSize,
      nom: this.filters.nom || undefined,
      minPrice: this.filters.minPrice,
      maxPrice: this.filters.maxPrice
    };

    this.productService.getAllProducts(productFilters).subscribe({
      next: (response: PageResponse<Product>) => {
        this.products = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        
        this.displayProducts = this.products.map(product => ({
          ...product,
          prixProduction: this.currencyPipe.transform(product.prixProduction),
          prixVente: this.currencyPipe.transform(product.prixVente),
          ingredientsCount: `${product.ingredientProduits.length} ingrédient(s)`
        }));
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des produits';
        console.error(err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 0;
    this.loadProducts();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  viewProduct(product: Product): void {
    console.log('Voir produit:', product);
    // TODO: Implémenter la vue détails
  }

  editProduct(product: Product): void {
    console.log('Modifier produit:', product);
    // TODO: Implémenter l'édition
  }

  deleteProduct(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression';
          console.error(err);
        }
      });
    }
  }
}
