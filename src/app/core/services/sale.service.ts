import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Sale, SaleResponse } from '../models/sale';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private API_URL = environment.apiUrl + '/sales';

  constructor(private http: HttpClient) { }

  createSale(sale: Sale) : Observable<SaleResponse> {
    return this.http.post<SaleResponse>(this.API_URL, sale);
  }

}
