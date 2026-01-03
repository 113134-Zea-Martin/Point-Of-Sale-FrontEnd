import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductCreateDTO } from '../../../core/models/product-create-dto';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrandService } from '../../../core/services/brand.service';
import { Brand } from '../../../core/models/brand';
import { forkJoin, Subscription } from 'rxjs';
import { Category } from '../../../core/models/category';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../core/models/product';
import { NewBrandCategoryComponent } from '../../../shared/components/new-brand-category/new-brand-category.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule, NewBrandCategoryComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loading = false;
  isEditMode = false;
  productId?: number;

  suscriptions: Subscription[] = [];
  brands: Brand[] = [];
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      barcode: ['', Validators.required],
      brandId: [null, Validators.required],
      categoryId: [null, Validators.required],
      purchasePrice: [null, [Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      salePrice: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      currentStock: [{ value: 0, disabled: true }, [Validators.min(0), Validators.pattern(/^\d+$/), Validators.required]],
      minimumStock: [null, [Validators.min(0), Validators.pattern(/^\d+$/), Validators.required]],
      active: [true]
    });
  }

  loadData(): void {
    // Cargar marcas y categorías primero
    const sus = forkJoin({
      brands: this.brandService.getBrands(),
      categories: this.categoryService.getCategories()
    }).subscribe({
      next: ({ brands, categories }) => {
        this.brands = brands;
        this.categories = categories;
        // Después de cargar los datos, verificar la ruta
        this.checkRoute();
      },
      error: (err) => {
        console.error('Error loading data:', err);
      }
    });
    this.suscriptions.push(sus);
  }

  productName: string = '';
  isDetailMode: boolean = false;

  checkRoute(): void {
    const barcode = this.route.snapshot.paramMap.get('barcode');
    console.log('Barcode from route:', barcode);

    if (barcode) {
      this.isEditMode = this.route.snapshot.routeConfig?.path?.includes('edit') || false;
      console.log('Is edit mode:', this.isEditMode);
      this.isDetailMode = !this.isEditMode;

      const sus = this.productService.getProductByBarcode(barcode).subscribe({
        next: (product: Product) => {
          // Si estamos en modo vista (no edit), deshabilitar el formulario
          if (!this.isEditMode) {
            this.form.disable();
          }

          this.productName = product.name || '';

          const brand = this.brands.find(b => b.name === product.brandName);
          const category = this.categories.find(c => c.name === product.categoryName);

          // Asegurarse de que los valores sean del tipo correcto
          const formValues = {
            name: product.name || '',
            barcode: product.barcode || barcode,
            brandId: brand ? brand.id : null,
            categoryId: category ? category.id : null,
            purchasePrice: product.purchasePrice || null,
            salePrice: product.salePrice || null,
            currentStock: product.currentStock ?? null,
            minimumStock: product.minimumStock ?? null
          };

          this.form.patchValue(formValues);

          // Si es edición, guardar el ID del producto si existe
          if (product.id) {
            this.productId = product.id;
          }
        },
        error: (err) => {
          console.error('Error loading product:', err);
        }
      });
      this.suscriptions.push(sus);
    } else {
      this.isEditMode = false;
      this.isDetailMode = false;
      this.productName = '';
    }
  }

  loadBrands() {
    const sus = this.brandService.getBrands().subscribe({
      next: (brands) => { this.brands = brands; }
    });
    this.suscriptions.push(sus);
  }

  loadCategories() {
    const sus = this.categoryService.getCategories().subscribe({
      next: (categories) => { this.categories = categories; }
    });
    this.suscriptions.push(sus);
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach(sus => sus.unsubscribe());
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;

    let obs$;
    if (this.isEditMode && this.productId) {
      // Modo edición: actualizar producto
      const updateData = {
        ...this.form.getRawValue(),
        currentStock: this.form.getRawValue().currentStock
      };
      delete updateData.initialStock; // Por si acaso
      obs$ = this.productService.updateProduct(this.productId, updateData);
    } else {
      // Modo creación: crear producto
      const createData: ProductCreateDTO = {
        ...this.form.getRawValue(),
        initialStock: 0 // Siempre 0
      };
      delete createData.currentStock;
      delete createData.active;
      obs$ = this.productService.createProduct(createData);
    }

    const sus = obs$.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/products']);
      },
      error: () => { this.loading = false; }
    });
    this.suscriptions.push(sus);
  }

  modalType: 'brand' | 'category' = 'brand';
  showModal = false;

  onAddBrand() {
    this.modalType = 'brand';
    this.showModal = true;
  }

  onAddCategory() {
    this.modalType = 'category';
    this.showModal = true;
  }

  onBrandOrCategoryCreated(newItem: { id: number, name: string }) {
    if (this.modalType === 'brand') {
      this.brands.push(newItem);
      this.form.patchValue({ brandId: newItem.id });
    } else {
      this.categories.push(newItem);
      this.form.patchValue({ categoryId: newItem.id });
    }
    this.showModal = false;
  }

}
