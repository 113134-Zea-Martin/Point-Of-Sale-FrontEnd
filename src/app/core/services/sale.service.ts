import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Sale, SaleRequestDto, SaleResponse, SaleResponseWithNameDto } from '../models/sale';
import { Observable } from 'rxjs';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private API_URL = environment.apiUrl + '/sales';

  constructor(private http: HttpClient) { }

  createSale(sale: Sale) : Observable<SaleResponse> {
    return this.http.post<SaleResponse>(this.API_URL, sale);
  }

  getSales(filters: SaleRequestDto): Observable<Page<SaleResponseWithNameDto>> {
    let params = new HttpParams();
    if (filters.userId) {
      params = params.set('userId', String(filters.userId));
    }
    if (filters.paymentType) {
      params = params.set('paymentType', filters.paymentType);
    }
    if (filters.fromDate) {
      params = params.set('fromDate', filters.fromDate);
    }
    if (filters.toDate) {
      params = params.set('toDate', filters.toDate);
    }
    if (filters.maxTotal) {
      params = params.set('maxTotal', String(filters.maxTotal));
    }
    params = params
      .set('page', String(filters.page ?? 0))
      .set('size', String(filters.size ?? 15))
      .set('sort', filters.sort ?? 'dateTime,desc');
    return this.http.get<Page<SaleResponseWithNameDto>>(this.API_URL, { params });

  }

}
