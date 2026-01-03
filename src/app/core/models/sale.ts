import { SaleDetail } from "./sale-detail";

export interface Sale {
    total: number;
    paymentType: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'MERCADO_PAGO';
    userId: number;
    saleDetails: SaleDetail[];
}

export interface SaleResponse {
    dateTime: string;
    total: number;
    paymentType: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'MERCADO_PAGO';
    userId: number;
    saleDetails: SaleDetail[];
}

export interface SaleResponseWithNameDto {
    dateTime: Date;
    total: number;
    paymentType: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'MERCADO_PAGO';
    userId: number;
    saleDetailsNameDtoList: SaleDetailsNameDtoList[];
}

export interface SaleDetailsNameDtoList {
    barcode: string;
    name: string;
    quantity: number;
    salePrice: number;
}

export interface SaleRequestDto {
    userId?: number;
    paymentType?: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'MERCADO_PAGO';
    fromDate?: string;
    toDate?: string;
    maxTotal?: number;
    page?: number;
    size?: number;
    sort?: string;
}