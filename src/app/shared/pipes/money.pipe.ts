import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money',
  standalone: true
})
export class MoneyPipe implements PipeTransform {

  transform(value: number | null | undefined): string {
    if (value == null) return '$ 0,00';

    return value.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS'
    });
  }
}
