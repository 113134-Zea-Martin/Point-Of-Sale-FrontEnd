import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ProductSearchComponent } from '../../../shared/components/product-search/product-search.component';
import { CartTableComponent } from '../../../shared/components/cart-table/cart-table.component';
import { CartItem } from '../../../core/models/cart-item';
import { Product } from '../../../core/models/product';
import { Sale } from '../../../core/models/sale';
import { SaleService } from '../../../core/services/sale.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sale-create',
  standalone: true,
  imports: [CommonModule, ProductSearchComponent, CartTableComponent, FormsModule],
  templateUrl: './sale-create.component.html',
  styleUrl: './sale-create.component.css'
})
export class SaleCreateComponent implements OnDestroy {
 cartItems: CartItem[] = [];
  paymentType: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'MERCADO_PAGO' = 'CASH';
  loading = false;
  successMsg = '';
  errorMsg = '';
  subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());    
  }

  constructor(private saleService: SaleService) {}

  onProductSelected(product: Product) {
    const found = this.cartItems.find(i => i.product.id === product.id);
    if (found) {
      found.quantity++;
    } else {
      this.cartItems.push({ product, quantity: 1, subtotal: product.salePrice });
    }
  }

  onIncrease(item: CartItem) {
    item.quantity++;
  }

  onDecrease(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  onRemove(item: CartItem) {
    this.cartItems = this.cartItems.filter(i => i.product.id !== item.product.id);
  }

  onQuantityChange(event: { item: CartItem, quantity: number }) {
    const found = this.cartItems.find(i => i.product.id === event.item.product.id);
    if (found && event.quantity > 0) {
      found.quantity = event.quantity;
    }
  }

  get total(): number {
    return this.cartItems.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
  }

  finalizarVenta() {
    if (this.cartItems.length === 0) return;
    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    const sale: Sale = {
      total: this.total,
      paymentType: this.paymentType,
      userId: 1, // Cambia esto por el usuario actual si lo tienes
      saleDetails: this.cartItems.map(item => ({
        barcode: item.product.barcode,
        quantity: item.quantity
      }))
    };

    const sus = this.saleService.createSale(sale).subscribe({
      next: res => {
        this.successMsg = 'Venta registrada correctamente';
        this.cartItems = [];
        this.loading = false;
      },
      error: err => {
      this.errorMsg = err?.error?.message || 'Error al registrar la venta';
        this.loading = false;
      }
    });
    this.subscriptions.push(sus);
  }
}