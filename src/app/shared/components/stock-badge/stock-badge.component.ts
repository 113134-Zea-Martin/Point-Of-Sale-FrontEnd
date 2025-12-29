import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stock-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-badge.component.html',
  styleUrl: './stock-badge.component.css'
})
export class StockBadgeComponent {

  @Input() current = 0;
  @Input() minimum = 0;

  get label(): string {
    if (this.current <= 0) return 'Sin stock';
    if (this.current <= this.minimum) return 'Bajo';
    return 'OK';
  }

  get cssClass(): string {
    if (this.current <= 0) return 'bg-danger';
    if (this.current <= this.minimum) return 'bg-warning text-dark';
    return 'bg-success';
  }
}