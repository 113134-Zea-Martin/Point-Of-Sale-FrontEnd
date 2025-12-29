import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentType',
  standalone: true
})
export class PaymentTypePipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '-';

    switch (value) {
      case 'CASH':
        return 'Efectivo';
      case 'CREDIT_CARD':
        return 'Tarjeta de crédito';
      case 'DEBIT_CARD':
        return 'Tarjeta de débito';
      case 'MERCADO_PAGO':
        return 'Mercado Pago';
      default:
        return value;
    }
  }
}
