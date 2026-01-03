import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovementReasonPipe } from '../../../shared/pipes/movement-reason.pipe';
import { StockHistory, StockRequestFilters } from '../../../core/models/stock';
import { from, Subject, Subscription, takeUntil } from 'rxjs';
import { StockService } from '../../../core/services/stock.service';

@Component({
  selector: 'app-stock-history',
  standalone: true,
  imports: [CommonModule, FormsModule, MovementReasonPipe],
  templateUrl: './stock-history.component.html',
  styleUrl: './stock-history.component.css'
})
export class StockHistoryComponent implements OnInit, OnDestroy {

  movements: StockHistory[] = [];
  loading = false;
  errorMsg = '';

  // Filtros
  filters = {
    search: '',
    movementType: '',
    dateRange: 'today',
    fromDate: '',
    toDate: ''
  }

  // Paginación
  page = 0;
  size = 20;
  totalPages = 0;
  totalElements = 0;

  private destroy$ = new Subject<void>();

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    // this.setDateRange(this.filters.dateRange);
    this.setDateRange('week');
    this.loadMovements();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setDateRange(range: string) {
  const today = new Date();
  if (range === 'today') {
    const from = new Date(today.setHours(0, 0, 0, 0));
    const to = new Date(today.setHours(23, 59, 59, 999));
    this.filters.fromDate = from.toISOString().slice(0, 10);
    this.filters.toDate = to.toISOString().slice(0, 10);
  } else if (range === 'week') {
    const from = new Date(today);
    from.setDate(today.getDate() - 6);
    from.setHours(0, 0, 0, 0);
    const to = new Date(today.setHours(23, 59, 59, 999));
    this.filters.fromDate = from.toISOString().slice(0, 10);
    this.filters.toDate = to.toISOString().slice(0, 10);
  } else if (range === 'custom') {
    // No modificar fromDate ni toDate, el usuario los elige
  } else {
    this.filters.fromDate = '';
    this.filters.toDate = '';
  }
}

  onDateRangeChange() {
    this.setDateRange(this.filters.dateRange);
    this.page = 0;
    this.loadMovements();
  }

  onFilter() {
    this.page = 0;
    this.loadMovements();
  }

  loadMovements() {
    this.loading = true;
    this.errorMsg = '';
    const params: StockRequestFilters = {
      page: this.page,
      size: this.size,
      sort: 'date,desc'
    };
    // Filtros
    if (this.filters.search) {
      params.productName = this.filters.search;
    }
    if (this.filters.movementType !== '') {
      params.movementType = this.filters.movementType as 'INPUT' | 'OUTPUT';
    }
    if (this.filters.fromDate) params.fromDate = this.filters.fromDate;
    if (this.filters.toDate) params.toDate = this.filters.toDate;

    this.stockService.getStockHistory(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.movements = res?.content ?? [];
          this.page = res?.number ?? 0;
          this.totalPages = res?.totalPages ?? 0;
          this.totalElements = res?.totalElements ?? 0;
          this.loading = false;
        },
        error: () => {
          this.movements = [];
          this.errorMsg = 'No se pudo cargar el historial de movimientos.';
          this.loading = false;
        }
      });
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.loadMovements();
    }
  }

  getMovementBadge(type: string): string {
    return type === 'INPUT' ? 'bg-success' : 'bg-danger';
  }

  getMovementIcon(type: string): string {
    return type === 'INPUT' ? 'bi-arrow-up' : 'bi-arrow-down';
  }

  getQuantityPrefix(type: string): string {
    return type === 'INPUT' ? '+' : '-';
  }
}