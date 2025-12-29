import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateBrandDTO } from '../../../core/models/brand';
import { CreateCategoryDTO } from '../../../core/models/category';
import { BrandService } from '../../../core/services/brand.service';
import { CategoryService } from '../../../core/services/category.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-brand-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-brand-category.component.html',
  styleUrl: './new-brand-category.component.css'
})
export class NewBrandCategoryComponent implements OnDestroy {
  @Input() type: 'brand' | 'category' = 'brand';
  @Input() show = false;
  @Output() created = new EventEmitter<{ id: number, name: string }>();
  @Output() closed = new EventEmitter<void>();

  name = '';
  loading = false;
  error = '';

    constructor(
    private brandService: BrandService,
    private categoryService: CategoryService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  subscriptions: Subscription[] = [];

  // Simula el servicio, reemplaza por tu BrandService/CategoryService real
  save() {
    this.loading = true;
    this.error = '';
    if (!this.name.trim()) {
      this.error = 'El nombre es obligatorio';
      this.loading = false;
      return;
    }

    if (this.type === 'brand') {
      const dto: CreateBrandDTO = { name: this.name.trim() };
      const sus = this.brandService.createBrand(dto).subscribe({
        next: (brand) => {
          this.created.emit(brand);
          this.name = '';
          this.close();
        },
        error: (err) => {
          this.error = 'Error al crear la marca';
          this.loading = false;
        }
      });
      this.subscriptions.push(sus);
    } else {
      const dto: CreateCategoryDTO = { name: this.name.trim() };
      const sus = this.categoryService.createCategory(dto).subscribe({
        next: (category) => {
          this.created.emit(category);
          this.name = '';
          this.close();
        },
        error: (err) => {
          this.error = 'Error al crear la categoría';
          this.loading = false;
        }
      });
      this.subscriptions.push(sus);
    }
  }

  close() {
    this.name = '';
    this.error = '';
    this.closed.emit();
  }
}