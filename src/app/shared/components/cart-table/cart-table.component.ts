import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MoneyPipe } from '../../pipes/money.pipe';
import { CartItem } from '../../../core/models/cart-item';

@Component({
  selector: 'app-cart-table',
  standalone: true,
  imports: [CommonModule, MoneyPipe],
  templateUrl: './cart-table.component.html',
  styleUrl: './cart-table.component.css'
})
export class CartTableComponent {

  @Input() items: CartItem[] = [];

  @Output() increase = new EventEmitter<CartItem>();
  @Output() decrease = new EventEmitter<CartItem>();
  @Output() remove = new EventEmitter<CartItem>();
  @Output() quantityChange = new EventEmitter<{ item: CartItem, quantity: number }>();


  onIncrease(item: CartItem) {
    this.increase.emit(item);
  }

  onDecrease(item: CartItem) {
    this.decrease.emit(item);
  }

  onRemove(item: CartItem) {
    this.remove.emit(item);
  }

  onQuantityInput(item: CartItem, event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    if (value > 0 && Number.isInteger(value)) {
      this.quantityChange.emit({ item, quantity: value });
    }
  }
}