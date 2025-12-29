import { SaleDetail } from "./sale-detail";

export interface Sale {
    total: number;
    paymentType: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'MERCADO_PAGO';
    userId: number;
    saleDetails: SaleDetail[];
}

export interface SaleResponse {

//     {
//   "dateTime": "2025-12-28 15:57:44",
//   "total": 45,
//   "paymentType": "CASH",
//   "userId": 1,
//   "saleDetails": [
//     {
//       "barcode": "000111222334",
//       "quantity": 1
//     }
//   ]
// }
    dateTime: string;
    total: number;
    paymentType: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'MERCADO_PAGO';
    userId: number;
    saleDetails: SaleDetail[];
}