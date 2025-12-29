import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand, CreateBrandDTO } from '../models/brand';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private apiUrl = environment.apiUrl + '/brands';

  constructor(private http: HttpClient) { }

  // Method for getting all brands
  getBrands() : Observable<Brand[]> {
    return this.http.get<Brand[]>(this.apiUrl);
  }

  createBrand(createBrandDto: CreateBrandDTO): Observable<Brand> {
    return this.http.post<Brand>(this.apiUrl, createBrandDto);
  }
}
