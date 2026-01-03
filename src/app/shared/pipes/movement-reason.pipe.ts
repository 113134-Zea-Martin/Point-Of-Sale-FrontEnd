import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'movementReason',
  standalone: true
})
export class MovementReasonPipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case 'SALE': return 'Venta';
      case 'PURCHASE': return 'Compra a proveedor';
      case 'ADJUSTMENT': return 'Ajuste';
      default: return value;
    }
  }

}
