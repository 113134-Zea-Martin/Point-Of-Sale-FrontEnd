import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockStatus',
  standalone: true
})
export class StockStatusPipe implements PipeTransform {

  transform(
    currentStock: number | null | undefined,
    minimumStock: number | null | undefined
  ): string {

    if (currentStock == null || minimumStock == null) {
      return 'SIN DATOS';
    }

    if (currentStock <= 0) {
      return 'SIN STOCK';
    }

    if (currentStock <= minimumStock) {
      return 'BAJO';
    }

    return 'OK';
  }
}
