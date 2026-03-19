import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { TableComponent, TableColumn, TableAction } from '../../../../shared/components/table/table';
import { FilterBarComponent, FilterField } from '../../../../shared/components/filter-bar/filter-bar';
import { ProductService, PageResponse, ProductFilters } from '../../services/product.service';
import { CurrencyPipe } from '../../../../core/pipes/currency.pipe';
import { Product, ProductRequest, ProductUpdate } from '../../../../models/product.model';
import { selectIsLoading, selectRole } from '../../../auth/store/auth.selectors';
import { ProductFormComponent } from '../../components/product-form/product-form';
import { ProductViewComponent } from '../../components/product-view/product-view';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import * as IngredientActions from '../../../admin/store/ingredient.actions';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent,
    TableComponent,
    FilterBarComponent,
    ProductFormComponent,
    ProductViewComponent,
    PaginationComponent,
    ConfirmDialogComponent
  ],
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
  showModal = false;
  isEditMode = false;
  selectedProduct: Product | null = null;
  showViewModal = false;
  selectedViewProduct: Product | null = null;
  showDeleteConfirm = false;
  productToDeleteId: number | null = null;

  currentPage = 0;
  pageSize = 5;
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
      callback: (item: Product) => this.openDeleteConfirm(item.id)
    }
  ];

  ngOnInit(): void {
    this.store.dispatch(IngredientActions.loadIngredients());
    this.loadProducts();
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedProduct = null;
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    // Keep original product for editing modal (prixProduction is server-calculated)
    this.isEditMode = true;
    this.selectedProduct = this.products.find((p) => p.id === product.id) ?? product;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditMode = false;
    this.selectedProduct = null;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedViewProduct = null;
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    const parseOptionalNumber = (value: unknown): number | undefined => {
      if (value === '' || value === null || value === undefined) return undefined;
      const n = typeof value === 'number' ? value : Number(value);
      return Number.isFinite(n) ? n : undefined;
    };

    const nom =
      typeof this.filters.nom === 'string' && this.filters.nom.trim().length > 0
        ? this.filters.nom.trim()
        : undefined;
    const minPrice = parseOptionalNumber(this.filters.minPrice);
    const maxPrice = parseOptionalNumber(this.filters.maxPrice);

    const productFilters: ProductFilters = {
      page: this.currentPage,
      size: this.pageSize,
      nom,
      minPrice,
      maxPrice
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  viewProduct(product: Product): void {
    this.selectedViewProduct = this.products.find((p) => p.id === product.id) ?? product;
    this.showViewModal = true;
  }

  editProduct(product: Product): void {
    this.openEditModal(product);
  }

  private normalizeIngredientProduits(
    rows: { ingredientId: number; quantite: number }[]
  ): { ingredientId: number; quantite: number }[] {
    const map = new Map<number, number>();
    for (const r of rows ?? []) {
      const id = Number(r.ingredientId);
      const q = Number(r.quantite);
      if (!id || !Number.isFinite(id) || !Number.isFinite(q) || q <= 0) continue;
      map.set(id, (map.get(id) ?? 0) + q);
    }
    return [...map.entries()].map(([ingredientId, quantite]) => ({ ingredientId, quantite }));
  }

  onSubmit(formData: { nom: string; prixVente: number; ingredientProduits: any[] }): void {
    const payloadBase = {
      nom: formData.nom,
      prixVente: Number(formData.prixVente),
      ingredientProduits: this.normalizeIngredientProduits(formData.ingredientProduits)
    };

    if (this.isEditMode && this.selectedProduct) {
      const update: ProductUpdate = payloadBase as ProductUpdate;
      this.productService.updateProduct(this.selectedProduct.id, update).subscribe({
        next: () => {
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          this.error = 'Erreur lors de la modification du produit';
          console.error(err);
        }
      });
      return;
    }

    const create: ProductRequest = payloadBase as ProductRequest;
    this.productService.createProduct(create).subscribe({
      next: () => {
        this.closeModal();
        this.loadProducts();
      },
      error: (err) => {
        this.error = 'Erreur lors de la création du produit';
        console.error(err);
      }
    });
  }

  openDeleteConfirm(id: number): void {
    this.productToDeleteId = id;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.productToDeleteId = null;
  }

  confirmDelete(): void {
    const id = this.productToDeleteId;
    if (id == null) return;
    this.closeDeleteConfirm();
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
