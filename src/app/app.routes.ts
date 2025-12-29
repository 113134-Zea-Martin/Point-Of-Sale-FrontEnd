import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { StockAdjustmentComponent } from './pages/stock/stock-adjustment/stock-adjustment.component';
import { SaleCreateComponent } from './pages/sales/sale-create/sale-create.component';

export const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent },
  // { path: 'products/:id/edit', component: ProductFormComponent }, // para edición
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  // app.routes.ts
{ path: 'products/new', component: ProductFormComponent },
{ path: 'products/:barcode/edit', component: ProductFormComponent },
{ path: 'products/:barcode', component: ProductFormComponent },
{ path: 'sales/new', component: SaleCreateComponent },
];
