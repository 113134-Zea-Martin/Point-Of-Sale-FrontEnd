import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../../core/models/product';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { ProductTableComponent } from '../../../shared/components/product-table/product-table.component';
import { Subscription } from 'rxjs';
import { ProductSearchComponent } from '../../../shared/components/product-search/product-search.component';
import { Router } from '@angular/router';
import { StockAdjustmentComponent } from '../../stock/stock-adjustment/stock-adjustment.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductTableComponent, ProductSearchComponent, StockAdjustmentComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {


  products: Product[] = [];
  loading = false;

  subscriptions: Subscription[] = [];

  // Paginación
  page = 0;
  size = 15;
  totalPages = 0;
  totalElements = 0;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(filters: any = { page: this.page, size: this.size }) {
    this.loading = true;
    const sus = this.productService.getProducts(filters).subscribe({
      next: (res) => {
        if (!res) {
          this.products = [];
          this.page = 0;
          this.totalPages = 0;
          this.totalElements = 0;
        } else {
          this.products = res.content;
          this.page = res.number;
          this.totalPages = res.totalPages;
          this.totalElements = res.totalElements;


          // Calcula métricas para las tarjetas de resumen
          this.totalProducts = this.products.length;

          // Stock crítico: productos con currentStock <= minimumStock
          this.lowStockCount = this.products.filter(
            p => (p.currentStock ?? 0) <= (p.minimumStock ?? 0)
          ).length;

          // Cantidad de categorías distintas
          this.categoryCount = new Set(this.products.map(p => p.categoryName)).size;

        }
        this.loading = false;
      },
      error: (err) => {
        this.products = [];
        this.page = 0;
        this.totalPages = 0;
        this.totalElements = 0;
        this.loading = false;
      }
    });
    this.subscriptions.push(sus);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.loadProducts({ page: page, size: this.size });
    }
  }

  onSelectProduct(product: any) {
    console.log('Producto seleccionado:', product);
    this.router.navigate(['/products', product.barcode]);
  }

  onEditProduct(product: any) {
    console.log('Producto a editar:', product);
    // Lógica para manejar la edición del producto
    this.router.navigate(['/products', product.barcode, 'edit']);
  }

  searchTerm: string | undefined;

  onSearch(term: string) {
    this.searchTerm = term;
    this.page = 0; // Reinicia a la primera página al buscar

    let filters: any = { page: this.page, size: this.size };

    if (/^\d+$/.test(term)) {
      filters.barcode = term;
    } else {
      filters.name = term;
    }


    this.loadProducts(filters);
  }

  onAddProduct() {
    // Aquí puedes abrir un modal, navegar a otra ruta, etc.
    // Por ejemplo, si usas routing:
    // this.router.navigate(['/products/new']);
    // O si usas un modal:
    // this.modalService.open(ProductFormComponent);
    console.log('Agregar producto');
    this.router.navigate(['/products/new']);
  }

  showStockModal = false;
  selectedProduct: any = null;

  openStockModal(product: any) {
    this.selectedProduct = product;
    this.showStockModal = true;
  }

  onStockSaved() {
    this.showStockModal = false;
    // Recargar productos si es necesario
    this.loadProducts();
  }

  totalProducts: number = 0;
  lowStockCount: number = 0;
  categoryCount: number = 0;


}