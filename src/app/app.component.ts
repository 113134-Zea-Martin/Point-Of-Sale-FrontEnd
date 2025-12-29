import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartItem } from './core/models/cart-item';
import { Product } from './core/models/product';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // title = 'GestionInventario';
  cartItems: CartItem[] = [
    // { product: { id: 1, name: 'Producto A', salePrice: 100 }, quantity: 2, subtotal: 200 },
    // { product: { id: 2, name: 'Producto B', salePrice: 150 }, quantity: 1, subtotal: 150 },
    // { product: { id: 3, name: 'Producto C', salePrice: 150 }, quantity: 3, subtotal: 450 }
  ];

  onRemoveItem(item: CartItem) {
    this.cartItems = this.cartItems.filter(i => i !== item);
  }

  onIncreaseItem(item: CartItem) {
    item.quantity++;
  }

  onDecreaseItem(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  confirmMessage = '¿Estás seguro de que deseas realizar esta acción?';

  onConfirm() {
    // Lógica para manejar la confirmación
    console.log('Acción confirmada');
  }
  onCancel() {
    // Lógica para manejar la cancelación
    console.log('Acción cancelada');
  }

  onSearch(query: string) {
    console.log('Búsqueda realizada con la consulta:', query);
    // Lógica para manejar la búsqueda de productos
  }

  onSelectProduct(product: any) {
    console.log('Producto seleccionado:', product);
    // Lógica para manejar la selección del producto
  }

  onEditProduct(product: any) {
    console.log('Producto a editar:', product);
    // Lógica para manejar la edición del producto
  }

  products: Product[] = [
    // { id: 1, name: 'Producto A', salePrice: 100, currentStock: 10, minimumStock: 5 },
    // { id: 2, name: 'Producto B', salePrice: 150, currentStock: 3, minimumStock: 5 },
    // { id: 3, name: 'Producto C', salePrice: 200, currentStock: 0, minimumStock: 5 }
  ]

  // ...existing code...
  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    console.log('Modo oscuro toggled');
  }
  // ...existing code...

}