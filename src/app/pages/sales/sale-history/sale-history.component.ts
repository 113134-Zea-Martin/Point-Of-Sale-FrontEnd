import { Component, OnDestroy, OnInit } from '@angular/core';
import { SaleResponseWithNameDto } from '../../../core/models/sale';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SaleService } from '../../../core/services/sale.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentTypePipe } from '../../../shared/pipes/payment-type.pipe';

@Component({
  selector: 'app-sale-history',
  standalone: true,
  imports: [CommonModule, FormsModule, PaymentTypePipe],
  templateUrl: './sale-history.component.html',
  styleUrl: './sale-history.component.css'
})
export class SaleHistoryComponent implements OnInit, OnDestroy {

  salesHistory: SaleResponseWithNameDto[] = [];
  loading = false;
  errorMsg = '';

  // Paginación
  page = 0;
  size = 15;
  totalPages = 0;
  totalElements = 0;

  // Filtros
  filters = {
    search: '',
    dateRange: 'today', // 'today' | 'week' | 'all'
    fromDate: '',
    toDate: ''
  };

  // Resumen
  summary = {
    totalToday: 0,
    countToday: 0
  };

  // Modal
  showProductsModal = false;
  selectedSale: SaleResponseWithNameDto | null = null;

  //Subscription
  suscriptions: Subscription[] = [];

  private destroy$ = new Subject<void>();

  constructor(private salesService: SaleService) { }

  ngOnInit(): void {
    this.setDateRange('week');
    this.loadHistory();
    this.loadSummary();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private formatDateOnly(date: Date): string {
    // Devuelve yyyy-MM-dd
    return date.toISOString().slice(0, 10);
  }

  setDateRange(range: string) {
    const today = new Date();
    if (range === 'today') {
      const from = new Date(today.setHours(0, 0, 0, 0));
      const to = new Date(today.setHours(23, 59, 59, 999));
      this.filters.fromDate = this.formatDateOnly(from);
      this.filters.toDate = this.formatDateOnly(to);
    } else if (range === 'week') {
      const from = new Date(today);
      from.setDate(today.getDate() - 6);
      from.setHours(0, 0, 0, 0);
      const to = new Date(today.setHours(23, 59, 59, 999));
      this.filters.fromDate = this.formatDateOnly(from);
      this.filters.toDate = this.formatDateOnly(to);
    } else {
      this.filters.fromDate = '';
      this.filters.toDate = '';
    }
  }

  onDateRangeChange() {
    this.setDateRange(this.filters.dateRange);
  }

  onFilter() {
    this.page = 0;
    this.loadHistory();
    this.loadSummary();
  }

  loadHistory() {
    this.loading = true;
    this.errorMsg = '';
    const params: any = {
      page: this.page,
      size: this.size,
      sort: 'dateTime,desc'
    };
    if (this.filters.fromDate) params.fromDate = this.filters.fromDate;
    if (this.filters.toDate) params.toDate = this.filters.toDate;
    if (this.filters.search) params.search = this.filters.search;

    const sus = this.salesService.getSales(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          let ventas = res?.content ?? [];
          // Filtrado local si el backend no lo soporta
          if (this.filters.search) {
            const searchLower = this.filters.search.toLowerCase();
            ventas = ventas.filter(v =>
              v.saleDetailsNameDtoList.some(item =>
                item.name.toLowerCase().includes(searchLower) ||
                item.barcode.toLowerCase().includes(searchLower)
              )
            );
          }
          this.salesHistory = ventas;
          this.page = res?.number ?? 0;
          this.totalPages = res?.totalPages ?? 0;
          this.totalElements = res?.totalElements ?? 0;
          this.loading = false;
        },
        error: () => {
          this.salesHistory = [];
          this.errorMsg = 'No se pudo cargar el historial de ventas. Intente nuevamente.';
          this.loading = false;
        }
      });
    this.suscriptions.push(sus);
  }

  loadSummary() {
    // Para demo: sumar ventas del día en la página actual
    // En producción, idealmente pedir un endpoint de resumen
    this.summary.totalToday = 0;
    this.summary.countToday = 0;
    const params: any = {
      page: 0,
      size: 1000,
      sort: 'dateTime,desc'
    };
    if (this.filters.fromDate) params.fromDate = this.filters.fromDate;
    if (this.filters.toDate) params.toDate = this.filters.toDate;
    if (this.filters.search) params.search = this.filters.search;

    const sus = this.salesService.getSales(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const ventas = res?.content ?? [];
          this.summary.totalToday = ventas.reduce((acc, v) => acc + v.total, 0);
          this.summary.countToday = ventas.length;
        }
      });
    this.suscriptions.push(sus);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.loadHistory();
    }
  }

  openProductsModal(sale: SaleResponseWithNameDto) {
    this.selectedSale = sale;
    this.showProductsModal = true;
    document.body.classList.add('modal-open');
  }

  closeProductsModal() {
    this.showProductsModal = false;
    this.selectedSale = null;
    document.body.classList.remove('modal-open');
  }

  getPaymentTypeBadge(type: string): string {
    switch (type) {
      case 'CASH': return 'bg-success text-white';
      case 'CREDIT_CARD':
      case 'DEBIT_CARD': return 'bg-primary text-white';
      case 'MERCADO_PAGO': return 'bg-info text-dark';
      default: return 'bg-secondary text-white';
    }
  }

}