import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StockHistory, StockRequest, StockRequestFilters, StockResponse } from '../models/stock';
import { Observable } from 'rxjs';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private API_URL = environment.apiUrl + '/stock';

  constructor(private http: HttpClient) { }

  createStockInput(stockRequest: StockRequest) : Observable<StockResponse> {
    return this.http.post<StockResponse>(`${this.API_URL}/input`, stockRequest);
  }

  createStockAdjustment(stockRequest: StockRequest) : Observable<StockResponse> {
    return this.http.post<StockResponse>(`${this.API_URL}/adjustment`, stockRequest);
  }

  getStockHistory(stockFilters: StockRequestFilters): Observable<Page<StockHistory>> {  
      let params = new HttpParams();
      if (stockFilters.productName) {
        params = params.set('productName', stockFilters.productName);
      }
      if (stockFilters.movementType) {
        params = params.set('movementType', stockFilters.movementType);
      }
      if (stockFilters.reason) {
        params = params.set('reason', stockFilters.reason);
      }
      if (stockFilters.fromDate) {
        params = params.set('fromDate', stockFilters.fromDate);
      }
      if (stockFilters.toDate) {
        params = params.set('toDate', stockFilters.toDate);
      }
      params = params
        .set('page', String(stockFilters.page ?? 0))
        .set('size', String(stockFilters.size ?? 15))
        .set('sort', stockFilters.sort ?? 'date,desc');
      return this.http.get<Page<StockHistory>>(this.API_URL, { params });
  }
}
