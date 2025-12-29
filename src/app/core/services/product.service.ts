import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductFilters } from '../models/product-filters';
import { Observable } from 'rxjs';
import { Page } from '../models/page';
import { Product } from '../models/product';
import { ProductCreateDTO } from '../models/product-create-dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // URL to web API
  private apiUrl = environment.apiUrl + '/products';

  constructor(private http: HttpClient) { }

  // Method to get all products
  getProducts(filters: ProductFilters = {}): Observable<Page<Product>> {
    let params = new HttpParams();
    if (filters.name) {
      params = params.set('name', filters.name);
    }

    if (filters.brand) {
      params = params.set('brand', filters.brand);
    }

    if (filters.category) {
      params = params.set('category', filters.category);
    }
    if (filters.barcode) {
      params = params.set('barcode', filters.barcode); // <-- agrega esto
    }

    // Solo traer productos activos si no se especifica lo contrario
    if (filters.active !== undefined) {
      params = params.set('active', String(filters.active));
    } else {
      params = params.set('active', 'true');
    }

    params = params
      .set('page', String(filters.page ?? 0))
      .set('size', String(filters.size ?? 2))
      .set('sort', filters.sort ?? 'id,asc');
    return this.http.get<Page<Product>>(this.apiUrl, { params });
  }

  // Method to create a new product
  createProduct(productCreatedDto: ProductCreateDTO): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, productCreatedDto);
  }


  getProductByBarcode(arg0: string): Observable<Product> {
    const url = `${this.apiUrl}/${arg0}`;
    return this.http.get<Product>(url);
  }

  // Method to update an existing product
  updateProduct(id: number, productCreatedDto: ProductCreateDTO): Observable<Product> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Product>(url, productCreatedDto);
  }

}
