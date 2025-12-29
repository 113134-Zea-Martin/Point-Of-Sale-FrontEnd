import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StockService } from '../../../core/services/stock.service';
import { StockRequest } from '../../../core/models/stock';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stock-adjustment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './stock-adjustment.component.html',
  styleUrl: './stock-adjustment.component.css'
})
export class StockAdjustmentComponent implements OnInit, OnDestroy, OnChanges {
  @Input() show = false;
  @Input() product: any = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private stockService: StockService
  ) {
    this.form = this.fb.group({
      type: ['input', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.form.reset({ type: 'input', quantity: null });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && changes['show'].currentValue) {
      // El modal se abrió, resetea el formulario
      this.form.reset({ type: 'input', quantity: null });
    }
  }

  subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  submit() {
    if (this.form.invalid || !this.product) return;
    const data: StockRequest = {
      productId: this.product.id,
      quantity: this.form.value.quantity,
      userId: 1 // Usuario fijo
    };

    const obs = this.form.value.type === 'input'
      ? this.stockService.createStockInput(data)
      : this.stockService.createStockAdjustment(data);

    const sus = obs.subscribe({
      next: () => {
        this.saved.emit();
        this.close();
      },
      error: () => alert('Error al guardar el movimiento de stock')
    });
    this.subscriptions.push(sus);
  }

  close() {
    this.closed.emit();
  }
}