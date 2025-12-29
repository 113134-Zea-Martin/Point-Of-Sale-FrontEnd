import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StockRequest, StockResponse } from '../models/stock';
import { Observable } from 'rxjs';

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
}
