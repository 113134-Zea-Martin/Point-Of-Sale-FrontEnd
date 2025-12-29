import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { Product } from '../../../core/models/product';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.css'
})
export class ProductSearchComponent implements OnDestroy {
  query = '';

  @Output() search = new EventEmitter<string>();
  @Output() select = new EventEmitter<Product>();


  private searchSubject = new Subject<string>();
  private sub: Subscription;

  constructor(private productService: ProductService) {
    this.sub = this.searchSubject
      .pipe(debounceTime(600)) // Espera 400ms después de dejar de tipear
      .subscribe(value => this.search.emit(value));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onClear() {
    this.query = '';
    this.search.emit('');
  }

  onQueryChange(value: string) {
    this.searchSubject.next(value.trim());
  }

  // Nuevo: Buscar producto al presionar Enter
  onEnter() {
    const term = this.query.trim();
    if (!term) return;

    // Buscar por barcode si es numérico, sino por nombre
    let filters: any = {};
    if (/^\d+$/.test(term)) {
      filters.barcode = term;
    } else {
      filters.name = term;
    }

    this.productService.getProducts(filters).subscribe(res => {
      if (res.content && res.content.length > 0) {
        this.select.emit(res.content[0]);
        this.query = '';
      }
    });
  }

  onSelectProduct(product: Product) {
    this.select.emit(product);
    this.query = '';
  }
}