import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../core/models/product';
import { CommonModule } from '@angular/common';
import { MoneyPipe } from '../../pipes/money.pipe';
import { StockStatusPipe } from '../../pipes/stock-status.pipe';
import { StockBadgeComponent } from "../stock-badge/stock-badge.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, MoneyPipe, StockBadgeComponent, RouterModule],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css'
})
export class ProductTableComponent {

  @Input() products: Product[] = [];
  @Input() loading = false;

  @Output() select = new EventEmitter<Product>();
  @Output() edit = new EventEmitter<Product>();


@Output() editStock = new EventEmitter<Product>();

  sortColumn: keyof Product = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  page = 1;
  pageSize = 10;

  get pagedProducts(): Product[] {
    const start = (this.page - 1) * this.pageSize;
    return this.sortedProducts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.pageSize);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
    }
  }

  get sortedProducts(): Product[] {
    return [...this.products].sort((a, b) => {
      const valueA = a[this.sortColumn] ?? '';
      const valueB = b[this.sortColumn] ?? '';
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onSort(column: keyof Product) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  onSelect(product: Product) {
    this.select.emit(product);
  }

  onEdit(product: Product) {
    this.edit.emit(product);
  }
}